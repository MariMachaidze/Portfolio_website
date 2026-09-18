import type { Handler } from "@netlify/functions";

function jsonResponse(statusCode: number, body: unknown) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}

const QUERY = `
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

interface GithubGraphqlResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions: number;
          weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
        };
      };
    };
  };
  errors?: { message: string }[];
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  const token = process.env.GITHUB_TOKEN_PUBLIC;
  const login = process.env.GITHUB_ACTIVITY_USERNAME;
  if (!token || !login) {
    return jsonResponse(500, { error: "GitHub activity is not configured" });
  }

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: QUERY, variables: { login } }),
    });

    if (!res.ok) {
      return jsonResponse(502, { error: "GitHub API request failed" });
    }

    const json = (await res.json()) as GithubGraphqlResponse;
    const calendar = json.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) {
      return jsonResponse(502, { error: "Unexpected GitHub API response" });
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
      body: JSON.stringify({
        totalContributions: calendar.totalContributions,
        weeks: calendar.weeks.map((week) => ({
          days: week.contributionDays.map((day) => ({ date: day.date, count: day.contributionCount })),
        })),
      }),
    };
  } catch {
    return jsonResponse(502, { error: "GitHub API request failed" });
  }
};
