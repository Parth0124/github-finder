import { createContext, useReducer } from "react";
import GithubReducer from "./GithubReducer";

const GithubContext = createContext();

const Github_URL = process.env.REACT_APP_GITHUB_URL;
const Github_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

export const GithubProvider = ({ children }) => {
    const initialState = {
        users: [],
        user: {},
        repos: [],
        loading: false
    };

    const [state, dispatch] = useReducer(GithubReducer, initialState);

    const searchUsers = async (text) => {
        setLoading();

        const params = new URLSearchParams({
            q: text
        });

        const response = await fetch(`${Github_URL}/search/users?${params}`, {
            headers: {
                Authorization: `token ${Github_TOKEN}`
            }
        });

        const { items } = await response.json();
        dispatch({
            type: 'GET_USERS',
            payload: items,
        });
    };

    const getUser = async (login) => {
        setLoading();

        const response = await fetch(`${Github_URL}/users/${login}`, {
            headers: {
                Authorization: `token ${Github_TOKEN}`
            }
        });

        if (response.status === 404) {
            window.location = '/notfound';
        } else {
            const userData = await response.json();
            dispatch({
                type: 'GET_USER',
                payload: userData,
            });

            getRepos(login); // Fetch repositories after getting user data
        }
    };

    const getRepos = async (login) => {
        setLoading();

        const response = await fetch(`${Github_URL}/users/${login}/repos`, {
            headers: {
                Authorization: `token ${Github_TOKEN}`
            }
        });

        const reposData = await response.json();
        dispatch({
            type: 'GET_REPOS',
            payload: reposData,
        });
    };

    const clearUsers = () => dispatch({ type: 'CLEAR_USERS' });

    const setLoading = () => dispatch({ type: 'SET_LOADING' });

    return (
        <GithubContext.Provider value={{
            users: state.users,
            loading: state.loading,
            searchUsers,
            clearUsers,
            getUser,
            getRepos, 
            user: state.user,
            repos: state.repos
        }}>
            {children}
        </GithubContext.Provider>
    );
};

export default GithubContext;
