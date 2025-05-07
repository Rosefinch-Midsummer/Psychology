// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item affix "><a href="前言.html">前言</a></li><li class="chapter-item affix "><li class="part-title">Online Courses</li><li class="chapter-item "><a href="CCNU心理学.html"><strong aria-hidden="true">1.</strong> CCNU心理学：我知无不言，它妙不可言</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="第一周心理学概观.html"><strong aria-hidden="true">1.1.</strong> 第一周心理学概观</a></li><li class="chapter-item "><a href="第二周各流派的大神和他们的故事.html"><strong aria-hidden="true">1.2.</strong> 第二周各流派的大神和他们的故事</a></li><li class="chapter-item "><a href="第三周行为背后的目的.html"><strong aria-hidden="true">1.3.</strong> 第三周行为背后的目的</a></li><li class="chapter-item "><a href="第四周轻松学习的技巧.html"><strong aria-hidden="true">1.4.</strong> 第四周轻松学习的技巧</a></li><li class="chapter-item "><a href="第五周人的感知和思维.html"><strong aria-hidden="true">1.5.</strong> 第五周人的感知和思维</a></li><li class="chapter-item "><a href="第六周情绪体验和压力调节.html"><strong aria-hidden="true">1.6.</strong> 第六周情绪体验和压力调节</a></li><li class="chapter-item "><a href="第七周催眠的真相.html"><strong aria-hidden="true">1.7.</strong> 第七周催眠的真相</a></li><li class="chapter-item "><a href="第八周你到底能有多聪明.html"><strong aria-hidden="true">1.8.</strong> 第八周你到底能有多聪明</a></li><li class="chapter-item "><a href="第九周什么样的性格最受欢迎.html"><strong aria-hidden="true">1.9.</strong> 第九周什么样的性格最受欢迎</a></li><li class="chapter-item "><a href="期末.html"><strong aria-hidden="true">1.10.</strong> 课程期末考试</a></li></ol></li><li class="chapter-item "><li class="part-title">Books&amp;Papers</li><li class="chapter-item "><a href="《自控力》.html"><strong aria-hidden="true">2.</strong> 自控力</a></li><li class="chapter-item "><a href="《非暴力沟通》.html"><strong aria-hidden="true">3.</strong> 非暴力沟通</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
