/* feedreader.js
 *
 * 这是 Jasmine 会读取的spec文件，它包含所有的要在你应用上面运行的测试。
 */

/* 我们把所有的测试都放在了 $() 函数里面。因为有些测试需要 DOM 元素。
 * 我们得保证在 DOM 准备好之前他们不会被运行。
 */
$(function(){
    /* 这是我们第一个测试用例 - 其中包含了一定数量的测试。这个用例的测试
     * 都是关于 Rss 源的定义的，也就是应用中的 allFeeds 变量。
    */
    describe('RSS Feeds', () => {
        /* 这是我们的第一个测试 - 它用来保证 allFeeds 变量被定义了而且
         * 不是空的。在你开始做这个项目剩下的工作之前最好实验一下这个测试
         * 比如你把 app.js 里面的 allFeeds 变量变成一个空的数组然后刷新
         * 页面看看会发生什么。
        */
        function ckeck_is_string_and_not_none(name) {
            expect(name).toBeDefined();
            expect(typeof name).toBe("string");
            expect(name.length).toBeGreaterThan(0);
        }

        it('RSS列表是否被定义 且 长度不为0', () => {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });

        /* 
         * 编写一个测试遍历 allFeeds 对象里面的所有的源来保证有链接字段而且链接不是空的。
         */
        it('测试allFeeds,保证有链接', () => {
            var regularExpressionUrl = /^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/; // 检查 URL 格式是否正确的正规表达式
            
            for(let feed of allFeeds) {
                ckeck_is_string_and_not_none(feed.url);
                expect(feed.url).toMatch(regularExpressionUrl); // 检查格式是否符合正则表达式      
            }
        });

        /* 
         * 编写一个测试遍历 allFeeds 对象里面的所有的源来保证有名字字段而且不是空的。
         */
        it('测试allFeeds,保证有名字', () => {
            for(let feed of allFeeds) {
                ckeck_is_string_and_not_none(feed.name);
            }
        });
    });

    /* 写一个叫做 "The menu" 的测试用例 */
    describe('RSS Feeds', () => {
        /*
         * 写一个测试用例保证菜单元素默认是隐藏的。你需要分析 html 和 css
         * 来搞清楚我们是怎么实现隐藏/展示菜单元素的。
         */
        it ('测试菜单元素默认是隐藏的', () => {
            expect($('body').length).toBe(1);
            expect($('body').hasClass('menu-hidden')).toBe(true);
        });

         /*
          * 写一个测试用例保证当菜单图标被点击的时候菜单会切换可见状态。这个
          * 测试应该包含两个 expectation ： 党点击图标的时候菜单是否显示，
          * 再次点击的时候是否隐藏。
          */
        it ('测试菜单元素点击后可以隐藏或者显示', () => {
            $('.menu-icon-link').trigger('click');
            expect($('body').hasClass('menu-hidden')).toBe(false);
            $('.menu-icon-link').trigger('click');
            expect($('body').hasClass('menu-hidden')).toBe(true);
        });
    });

    /** 因为中众所周知的VPN的原因，用VPN访问国外服务的超时判断时间调长 */
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30 * 1000;

    /* 写一个叫做 "Initial Entries" 的测试用例 */
    describe('Initial Entries', () => {
        /*
         * 写一个测试保证 loadFeed 函数被调用而且工作正常，即在 .feed 容器元素
         * 里面至少有一个 .entry 的元素。
         *
         * 记住 loadFeed() 函数是异步的所以这个而是应该使用 Jasmine 的 beforeEach
         * 和异步的 done() 函数。
         */
        let index = 0;

        beforeEach((done) => {
            loadFeed(index, done);
            // console.log("beforeEach " + index);
            index ++;
        });

        /** 
         * 循环检查所有的rss是否都正常
         */
        for (let i = 0; i < allFeeds.length; i ++) {
            it(`loadFeed 调用 rss ${i} 正常, 至少1个 .entry 元素`, () => {
                // console.log($('.feed').find('.entry').first().html());
                expect($('.feed').find('.entry').length).toBeGreaterThan(0);
            });
        }
    });

    /* 写一个叫做 "New Feed Selection" 的测试用例 */
    describe('New Feed Selection', () => {
        
        /*
         * 写一个测试保证当用 loadFeed 函数加载一个新源的时候内容会真的改变。
         * 记住，loadFeed() 函数是异步的。
         */
        let firstRssEntry0;
        let secondRssEntry0;

        beforeEach((done) => {
            // 首先加载旧源 rss 0
            firstRssEntry0 = $('.feed').find('.entry').first().html();
            
            loadFeed(0, () => {
                firstRssEntry0 = $('.feed').find('.entry').first().html();
                loadFeed(1, () => {
                    secondRssEntry0 = $('.feed').find('.entry').first().html();
                    done();
                });
            });
        });

        it("测试加载新源的时候内容会变", () => {
            expect(firstRssEntry0).toBeDefined();
            expect(typeof firstRssEntry0).toBe("string");
            expect(firstRssEntry0.length).toBeGreaterThan(0);

            expect(secondRssEntry0).toBeDefined();
            expect(typeof secondRssEntry0).toBe("string");
            expect(secondRssEntry0.length).toBeGreaterThan(0);

            expect(secondRssEntry0).not.toEqual(firstRssEntry0);
        });
    });
}());
