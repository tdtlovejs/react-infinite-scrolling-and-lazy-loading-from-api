import useArticlesQuery from "./useArticlesQuery";
import {useCallback, useRef, useState} from "react";
import {Spin, Input, Col, Row, Switch} from 'antd';
import "./assets/css/ArticlesPage.css";
import 'antd/dist/antd.css';
import VietnamPicture from "./assets/images/vietname.jpg";

const RenderArticle = (props) => {
    const {
        article,
        isScrollVertical
    } = props;
    return (
        <Row>
            <Col xs={24} sm={24} md={isScrollVertical ? 8 : 24} lg={isScrollVertical ? 6 : 8} className="article_image_wrapper">
                <img src={article["urlToImage"] ?? VietnamPicture} alt=""/>
            </Col>
            <Col xs={24} sm={24} md={isScrollVertical ? 16 : 24} lg={isScrollVertical ? 18 : 16} className="article_content">
                <a href={article["url"]} target="_blank" className="article_title">
                    {article["title"]}
                </a>
                <div className="article_description">
                    {article["description"]}
                </div>
            </Col>
        </Row>
    )
}

const ArticlesPage = (props) => {
    const [query, setQuery] = useState('')
    const [pageNumber, setPageNumber] = useState(1);
    const [isScrollVertical, setIsScrollVertical] = useState(true);
    const {
        articles,
        hasMore,
        loading,
        error
    } = useArticlesQuery(query, pageNumber);
    const observer = useRef();
    const lastArticlesElementRef = useCallback(node => {
        if (loading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPageNumber(prevPageNumber => prevPageNumber + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore])

    return (
        <div className="articles_page_wrapper">
            <div className="articles_page_search">
                <Switch
                    checkedChildren={
                        "scroll vertical"
                    }
                    unCheckedChildren={
                        "scroll horizontal"
                    }
                    checked={isScrollVertical}
                    onChange={(checked) => {
                        setIsScrollVertical(checked)
                    }}
                />
                <Input.Search value={query} onChange={(event) => {
                    setQuery(event.target.value);
                    setPageNumber(1);
                }} allowClear style={{ width: 300 }} placeholder="Enter keyword ..." className="search_input"/>
            </div>
            <div className={"articles_page_body" + (isScrollVertical ? "" : " horizontal")}>
                {
                    articles.map((article, index) => {
                        if (articles.length === index + 1) {
                            return (
                                <div className="article_item" ref={lastArticlesElementRef}>
                                    <RenderArticle isScrollVertical={isScrollVertical} article={article}/>
                                </div>
                            )
                        } else {
                            return (
                                <div className="article_item">
                                    <RenderArticle isScrollVertical={isScrollVertical} article={article}/>
                                </div>
                            )
                        }
                    })
                }
                {
                    loading ?
                        <div className="loading">
                            <Spin />
                        </div>
                        :
                        <>
                            {articles.length === 0 && <div>
                                No article
                            </div>}
                        </>
                }
            </div>
        </div>
    )
}

export default ArticlesPage;