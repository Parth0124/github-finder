const Github_URL = process.env.REACT_APP_GITHUB_URL;
const Github_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

export  const searchUsers = async (text) => {
    const params = new URLSearchParams({
        q: text
    });
    const response = await fetch(`${Github_URL}/search/users?${params}`, {
        headers: {
            Authorization: `token ${Github_TOKEN}`
        }
    });
    const { items } = await response.json();
    return items
};


