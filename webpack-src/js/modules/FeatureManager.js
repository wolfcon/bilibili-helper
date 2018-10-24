/**
 * Author: DrowsyFlesh
 * Create: 2018/10/23
 * Description:
 */

import _ from 'lodash';
import * as allFeatures from './index';

const {Feature, ...Features} = allFeatures;

export class FeatureManager {
    constructor() {
        this.features = {};
        this.loadFeatures();
        this.addListener();
    }

    // 特性模块载入
    loadFeatures = () => {
        _.map(Features, (FeatureClass, featureName) => {
            if (!this.features[featureName]) {
                this.features[featureName] = new FeatureClass();
            }
        });
    };

    // 绑定相关监听事件
    addListener = () => {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.commend === 'getOptions') {
                let features;
                if (message.kind) features = _.filter(this.features, (feature) => feature.kind === message.kind);
                else features = this.features;
                sendResponse(_.merge(features, (feature) => feature.optionArguments));
            } else if (message.commend === 'getOption' && typeof message.feature === 'string') {
                const featureName = _.upperFirst(message.feature);
                if (this.features[featureName]) sendResponse(this.features[featureName].options);
                else console.error(`Invalid feature name: ${featureName}`);
            }
        });
    };
}