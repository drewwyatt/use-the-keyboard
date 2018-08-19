// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

const blockedIds = [
  'T-I J-J5-Ji T-I-KE L3',
];

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ blockedIds }, () => console.log('Preparing to block clicks on:', blockedIds));
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { hostEquals: 'mail.google.com' }
        })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});
