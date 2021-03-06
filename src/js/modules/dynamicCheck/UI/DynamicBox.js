/**
 * Author: DrowsyFlesh
 * Create: 2018/10/21
 * Description:
 */

import _ from 'lodash';
import React from 'react';
import styled from 'styled-components';
import {createTab} from 'Utils';

const FeedsContainer = styled.div.attrs({className: 'feeds-container'})`
  padding: 9px 0 9px 10px;
  max-height: 258px;
  overflow: auto;
`;
const FeedBox = styled.div.attrs({className: 'feed-box'})`
  position: relative;
  margin-bottom: 1px;
  cursor: pointer;
  &:hover {
    .feed-img {
      filter: grayscale(0) brightness(0.8);
      background-size: 100% auto;
    }
    .feed-info {
      //opacity: 0;
    }
  }
  &:last-of-type {
    margin-bottom: 0;
  }
  &::-webkit-scrollbar {
    display: none;
  }
`;

const FeedImg = styled.div.attrs({className: 'feed-img'})`
  width: 200px;
  height: 85px;
  background-size: 130% auto;
  background-position: center;
  background-color: #eee;
  filter: grayscale(0.5) brightness(0.4);
  box-shadow: inset 0px 0px 50px -10px #333;
  transition: all 0.3s;
`;

const FeedTitle = styled.h4.attrs({className: 'feed-title'})`
  position: absolute;
  bottom: 4px; 
  width: 230px;
  margin: 0;
  transform: scale(0.8) translateX(-20px);
  font-size: 12px;
  font-weight: normal;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: #fff;
`;

const FeedInfo = styled.div.attrs({className: 'feed-info'})`
  display: flex;
  justify-content: space-between;
  width: 230px;
  position: absolute;
  top: 5px;
  left: 0px;
  font-size: 12px;
  transform: scale(0.8) translateX(-20px);
  transition: all 0.3s;
  color: #fff;
  opacity: 1;
`;

export class DynamicBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            feedList: [],
        };
    }

    componentDidMount() {
        chrome.runtime.sendMessage({
            commend: 'getDynamicList',
        }, (feedList) => this.setState({feedList}));
    }

    handleOnClick = (link) => {
        chrome.runtime.sendMessage({
            commend: 'setGAEvent',
            action: 'click',
            category: 'dynamicCheck',
            label: 'dynamicCheck',
        });
        createTab(link);
    };

    render() {
        const {feedList} = this.state;
        return (
            feedList && feedList.length > 0 ? <FeedsContainer>
                {_.map(feedList, (feed, index) => {
                    const {link, pic, title, author, duration} = feed.addition;
                    return (
                        <FeedBox key={index} onClick={() => this.handleOnClick(link)}>
                            <FeedImg style={{backgroundImage: `url(${pic})`}}/>
                            <FeedInfo><span title={author}>{author}</span><span>{duration}</span></FeedInfo>
                            <FeedTitle title={title}>{title}</FeedTitle>
                        </FeedBox>
                    );
                })}
            </FeedsContainer> : <div/>
        );
    }
}
