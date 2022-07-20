import {useEffect, useState} from "react";
import axios from "axios";
import {API_KEY, BASE_API, PAGE_SIZE} from "./constants";

export default function useArticlesQuery(query, pageNumber) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [articles, setArticles] = useState([]);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        setArticles([]);
    }, [query])

    useEffect(() => {
        let cancel
        setLoading(true);
        setError(false);
        let url = `${BASE_API}/articles?page=${pageNumber}&pageSize=${PAGE_SIZE}`;
        if (query) {
            url += `&q=${query}`
        }
        axios({
            method: 'GET',
            url: url,
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            setArticles(prevArticles => {
                return [...new Set([...prevArticles, ...res.data.articles])]
            })
            setHasMore(pageNumber < res.data.maxPerPage)
            setLoading(false)
        }).catch(e => {
            setLoading(false)
            setError(true)
            if (axios.isCancel(e)) return
        })
        return () => cancel()
    }, [query, pageNumber])

    return { loading, error, articles, hasMore }
}