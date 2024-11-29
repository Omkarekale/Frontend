import axios from "axios";
import { TWEET_API_END_POINT } from "../utils/constant";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTweets } from "../redux/tweetSlice";

const useGetMyTweets = (id) => {
    const dispatch = useDispatch();
    const { refresh, isActive } = useSelector(store => store.tweet);

    // Memoize fetchMyTweets using useCallback
    const fetchMyTweets = useCallback(async () => {
        try {
            const { data } = await axios.get(`${TWEET_API_END_POINT}/alltweets/${id}`, {
                withCredentials: true
            });
            if (data.tweets) {
                dispatch(getAllTweets(data.tweets));
            }
        } catch (error) {
            console.error("Error fetching my tweets:", error);
        }
    }, [id, dispatch]);  // `id` and `dispatch` are the dependencies

    // Memoize followingTweetHandler using useCallback
    const followingTweetHandler = useCallback(async () => {
        try {
            const { data } = await axios.get(`${TWEET_API_END_POINT}/followingtweets/${id}`, {
                withCredentials: true
            });
            if (data.tweets) {
                dispatch(getAllTweets(data.tweets));
            }
        } catch (error) {
            console.error("Error fetching following tweets:", error);
        }
    }, [id, dispatch]);  // `id` and `dispatch` are the dependencies

    useEffect(() => {
        // Ensure the correct API is called based on the `isActive` flag
        if (isActive) {
            fetchMyTweets();
        } else {
            followingTweetHandler();
        }
    }, [id, isActive, refresh, fetchMyTweets, followingTweetHandler]);  // Include memoized functions in dependency array
};

export default useGetMyTweets;