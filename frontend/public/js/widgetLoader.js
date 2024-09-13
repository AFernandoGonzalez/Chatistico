(() => {
    
    let iframeElement = null;
    let customerId = null;
    const iframeId = "chatbot-widget-iframe";
    const scriptId = "chatling-embed-script";
    const inlineBotContainerId = "inline-bot-container";
    let openChatButton = null;
    let closeChatButton = null;
    let attentionGrabberElement = null;
    let autoOpenDelay = 0;
    let isAutoOpenEnabledOnDesktop = false;
    let isAutoOpenEnabledOnMobile = false;
    let autoOpenBehavior = null;
    const widgetStyles = {
        floating: "floating",
        fullscreen: "fullscreen",
        inline: "page_inline"
    };
    let widgetDisplayType = widgetStyles.floating;
    const zIndexHighest = 2147483647;
    const transitionDuration = 200;
    let isReturnUser = false;
    const cookieNames = {
        LAST_PAGEVIEW: "last_pageview",
        SESSION_ID: "session_id",
        LOCAL_STORAGE_SESSION_ID: "local_storage_session_id"
    };

    const API_BASE_URL = 'http:

    
    function getCookieName(baseName) {
        if (!baseName || baseName.trim().length === 0) return null;
        if (!customerId) customerId = getWidgetId();
        return customerId ? `${baseName}_${customerId}` : null;
    }

    function getCookie(name) {
        const nameEQ = `${name}=`;
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let c = cookies[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function setCookie(name, value, daysToExpire, sameSite = "Strict") {
        if (!name) return;
        let expires = "";
        if (daysToExpire) {
            const date = new Date();
            date.setTime(date.getTime() + daysToExpire * 24 * 60 * 60 * 1000);
            expires = `;expires=${date.toUTCString()}`;
        }
        const domain = window.location.hostname || location.hostname;
        document.cookie = `${name}=${value || ""}${expires};path=/;domain=.${domain};SameSite=${sameSite}`;
    }

    function getWidgetId() {
        const scriptElement = document.getElementById(scriptId);
        if (scriptElement) {
            const dataId = scriptElement.getAttribute("data-id");
            return dataId && dataId.trim().length > 0 ? dataId : null;
        }
    }

    function postMessageToIframe(message, targetOrigin = "*") {
        try {
            if (iframeElement) {
                iframeElement.contentWindow.postMessage(message, targetOrigin);
            }
        } catch (error) {
            console.error("Error posting message to iframe:", error);
        }
    }

    function saveDataToLocalStorage(data) {
        if (!data) return;
        try {
            const customerCookie = getCustomerIdCookie();
            if (!customerCookie) return;
            for (let key in data) {
                if (data[key] === null) delete data[key];
            }
            const dataString = JSON.stringify(data);
            setCookie(customerCookie, btoa(dataString), 365);
        } catch (error) {
            console.error("Error saving data to local storage:", error);
        }
    }

    function getCustomerIdCookie() {
        return getCookieValue("customer_id");
    }

    function getCookieValue(cookieName) {
        if (!cookieName || cookieName.length === 0) return null;
        if (!customerId) customerId = getWidgetId();
        const fullCookieName = getCookieName(cookieName);
        return fullCookieName ? getCookie(fullCookieName) : null;
    }

    function getChatSessions() {
        const chatSessionsCookie = getChatSessionsCookie();
        if (!chatSessionsCookie) return [];
        const cookieValue = getCookie(chatSessionsCookie);
        let sessions = [];
        if (!cookieValue) return sessions;
        try {
            const decodedValue = atob(cookieValue);
            if (!decodedValue || decodedValue.length === 0) return sessions;
            sessions = JSON.parse(decodedValue);
        } catch (error) {
            console.error("Error getting chat sessions:", error);
        }
        return sessions;
    }

    function getChatSessionsCookie() {
        return getCookieValue("chat_sessions");
    }

    function clearChatSessions() {
        const chatSessionsCookie = getChatSessionsCookie();
        if (!chatSessionsCookie) return;
        document.cookie = `${chatSessionsCookie}=; Max-Age=-99999999;`;
    }

    function saveChatSession(chatId, customerId) {
        const chatSessionsCookie = getChatSessionsCookie();
        if (!chatSessionsCookie) return;
        let sessions = getChatSessions() || [];
        sessions = [];
        const session = {
            chat_gid: chatId,
            customer_gid: customerId,
            created_at: Date.now()
        };
        sessions.push(session);
        const sessionData = JSON.stringify(sessions);
        setCookie(chatSessionsCookie, btoa(sessionData), 30);
    }

    
    function initializeWidget() {
        customerId = getWidgetId();
        widgetDisplayType = getDisplayType();
        if (!customerId) return;

        fetch(`${API_BASE_URL}/embed/chatbot/setup`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                widget_id: customerId,
                display_type: widgetDisplayType,
                page_url: window.location.href
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data?.success) {
                createIframeWidget(data.data);
                applyResponsiveStyles();
                initializeAutoOpen(data.data);
                toggleAttentionGrabber("show");

                setupChatIcons(); 
            }
        })
        .catch(error => {
            console.error("Error initializing widget:", error);
        });
    }

    
    function createIframeWidget(options) {
        iframeElement = document.createElement("iframe");
        iframeElement.setAttribute("allow", "microphone");
        iframeElement.src = `http:
        iframeElement.style.border = "none";

        if (widgetDisplayType === widgetStyles.fullscreen) {
            iframeElement.style.position = "fixed";
            iframeElement.style.height = "100%";
            iframeElement.style.width = "100%";
            iframeElement.style.zIndex = `${zIndexHighest}`;
            iframeElement.style.overflow = "hidden";
            iframeElement.style.top = "0";
            iframeElement.style.left = "0";
        } else if (widgetDisplayType === widgetStyles.inline) {
            iframeElement.style.height = "100%";
            iframeElement.style.width = "100%";
            iframeElement.style.overflow = "hidden";
        } else {
            setupFloatingWidgetStyles(options);
        }

        iframeElement.id = iframeId;
        iframeElement.className = `chatbot-display-${widgetDisplayType}`;
        iframeElement.addEventListener("load", () => {
            if (widgetDisplayType === widgetStyles.floating) {
                iframeElement.style.boxShadow = "rgba(0, 0, 0, 0.01) 0px 5px 10px 0px, rgba(0, 0, 0, 0.1) 0px 7px 12px 0px";
            }
        });

        if (widgetDisplayType === widgetStyles.inline) {
            const inlineContainer = document.getElementById(inlineBotContainerId);
            if (inlineContainer) inlineContainer.appendChild(iframeElement);
        } else {
            document.body.appendChild(iframeElement);
        }
    }

    function setupFloatingWidgetStyles(options) {
        const position = options.position?.value || 'br'; 
        const posX = parseInt(options.position?.x) || 0;
        const posY = parseInt(options.position?.y) || 0;
        const iconSize = options.chat_icon?.size || 50; 
        const interfaceWidth = options.chat_interface?.width || 350; 
        let maxHeight = window.innerHeight - (posY + iconSize + 20) - 50;
        maxHeight = maxHeight > 700 ? 700 : maxHeight;

        iframeElement.style.display = "none";
        iframeElement.style.position = "fixed";
        iframeElement.style.height = "80vh";
        iframeElement.style.minHeight = "80px";
        iframeElement.style.maxHeight = `${maxHeight}px`;
        iframeElement.style.overflow = "hidden";
        iframeElement.style.width = "100%";
        iframeElement.style.maxWidth = `${interfaceWidth}px`;
        iframeElement.style.borderRadius = "15px";
        iframeElement.style.transition = `transform ${transitionDuration}ms ease-in-out 0s`;
        iframeElement.style.transform = "scale(0)";
        iframeElement.style.zIndex = "-1";

        if (position === "bl") {
            iframeElement.style.bottom = `${posY + iconSize + 20}px`;
            iframeElement.style.left = `${posX}px`;
            iframeElement.style.transformOrigin = "bottom left";
        } else if (position === "tl") {
            iframeElement.style.top = `${posY + iconSize + 20}px`;
            iframeElement.style.left = `${posX}px`;
            iframeElement.style.transformOrigin = "top left";
        } else if (position === "tr") {
            iframeElement.style.top = `${posY + iconSize + 20}px`;
            iframeElement.style.right = `${posX}px`;
            iframeElement.style.transformOrigin = "top right";
        } else {
            iframeElement.style.bottom = `${posY + iconSize + 20}px`;
            iframeElement.style.right = `${posX}px`;
            iframeElement.style.transformOrigin = "bottom right";
        }
    }

    
    function applyResponsiveStyles() {
        if (widgetDisplayType === widgetStyles.floating) {
            const styles = `
                @media all and (max-width: 640px) {
                    #${iframeId}.chatbot-display-${widgetStyles.floating} {
                        width: 100% !important;
                        max-width: initial !important;
                        right: 0px !important;
                        top: 0px !important;
                        left: 0 !important;
                        bottom: 0px !important;
                        max-height: initial !important;
                        height: 100% !important;
                        border-radius: 0px !important;
                    }
                }
                #open-chat-icon, #close-chat-icon {
                    transition: scale 0.2s ease 0s;
                    scale: 1;
                }
                #open-chat-icon:hover, #close-chat-icon:hover {
                    scale: 1.1;
                }
            `;
            const styleSheet = document.createElement("style");
            if (styleSheet.styleSheet) {
                styleSheet.styleSheet.cssText = styles;
            } else {
                styleSheet.appendChild(document.createTextNode(styles));
            }
            document.head.appendChild(styleSheet);
        }
    }

    
    function setupChatIcons() {
        if (!openChatButton) {
            openChatButton = document.createElement('img');
            openChatButton.id = 'open-chat-icon';
            openChatButton.src = 'https:
            openChatButton.style.width = '45px'; 
            openChatButton.style.height = '45px'; 
            openChatButton.style.cursor = 'pointer';
            openChatButton.style.position = 'fixed';
            openChatButton.style.bottom = '20px';
            openChatButton.style.right = '20px';
            openChatButton.style.zIndex = `${zIndexHighest}`;
            document.body.appendChild(openChatButton);
            openChatButton.addEventListener('click', showChatWidget);
        }

        if (!closeChatButton) {
            closeChatButton = document.createElement('img');
            closeChatButton.id = 'close-chat-icon';
            closeChatButton.src = 'https:
            closeChatButton.style.width = '45px'; 
            closeChatButton.style.height = '45px'; 
            closeChatButton.style.cursor = 'pointer';
            closeChatButton.style.position = 'fixed';
            closeChatButton.style.bottom = '20px';
            closeChatButton.style.right = '20px';
            closeChatButton.style.zIndex = `${zIndexHighest}`;
            closeChatButton.style.display = 'none'; 
            document.body.appendChild(closeChatButton);
            closeChatButton.addEventListener('click', hideChatWidget);
        }
    }

    
    function showChatWidget() {
        if (!iframeElement) iframeElement = document.getElementById(iframeId);
        if (iframeElement) {
            iframeElement.style.zIndex = zIndexHighest;
            iframeElement.style.display = "block";
            setTimeout(() => {
                iframeElement.style.transform = "scale(1)";
            }, 10);
            setCookie(getChatOpenedCookie(), true, 30);
            hideAttentionGrabber();
            postMessageToIframe({ event_id: "chat_widget_opened" });
            toggleAttentionGrabber("hide");
            openChatButton.style.display = "none";
            closeChatButton.style.display = "block";
        }
    }

    function hideChatWidget() {
        if (!iframeElement) iframeElement = document.getElementById(iframeId);
        if (iframeElement) {
            iframeElement.style.transform = "scale(0)";
            setTimeout(() => {
                iframeElement.style.zIndex = -1;
                iframeElement.style.display = "none";
            }, transitionDuration);
            postMessageToIframe({ event_id: "chat_widget_closed" });
            toggleAttentionGrabber("show");
            openChatButton.style.display = "block";
            closeChatButton.style.display = "none";
        }
    }

    function initializeAutoOpen(data) {
        const autoOpenSettings = {
            enable_on_desktop: data.enable_on_desktop,
            enable_on_mobile: data.enable_on_mobile,
            delay: data.auto_open_delay,
            behavior: data.auto_open_behavior,
        };

        if (autoOpenSettings) {
            isAutoOpenEnabledOnDesktop = autoOpenSettings.enable_on_desktop;
            isAutoOpenEnabledOnMobile = autoOpenSettings.enable_on_mobile;
            autoOpenDelay = autoOpenSettings.delay || 0;
            autoOpenBehavior = autoOpenSettings.behavior;
            handleAutoOpen();
        }
    }

    function handleAutoOpen() {
        if (autoOpenBehavior === "open_once") {
            if (isChatWidgetVisible() || isAttentionGrabberHidden()) return;
        }
        if (isMobileView()) {
            if (isAutoOpenEnabledOnMobile) {
                autoOpenDelay = setTimeout(showChatWidget, autoOpenDelay * 1000);
            }
        } else {
            if (isAutoOpenEnabledOnDesktop) {
                autoOpenDelay = setTimeout(showChatWidget, autoOpenDelay * 1000);
            }
        }
    }

    function toggleAttentionGrabber(displayState) {
        if (!attentionGrabberElement) return;
        if (displayState === "hide") {
            attentionGrabberElement.style.display = "none";
            setCookie(getAttentionGrabberCookie(), true, 30);
        } else if (displayState === "show" && !isChatWidgetVisible() && !isAttentionGrabberHidden()) {
            attentionGrabberElement.style.display = "block";
        }
    }

    function isChatWidgetVisible() {
        if (iframeElement) {
            return iframeElement.style.display === "block";
        } else if (document.getElementById(iframeId).style.scale === "1") {
            return true;
        }
        return false;
    }

    function hideAttentionGrabber() {
        if (attentionGrabberElement) {
            attentionGrabberElement.style.display = "none";
        }
    }

    function isAttentionGrabberHidden() {
        const attentionGrabberCookie = getAttentionGrabberCookie();
        if (!attentionGrabberCookie) return false;
        const cookieValue = getCookie(attentionGrabberCookie);
        return cookieValue === "1" || cookieValue === "true";
    }

    function getAttentionGrabberCookie() {
        return getCookieValue("attention_grabber");
    }

    function getChatOpenedCookie() {
        return getCookieValue("chat_opened");
    }

    function isMobileView() {
        const width = window.innerWidth;
        return width !== null && width < 640;
    }

    function getDisplayType() {
        const scriptElement = document.getElementById(scriptId);
        if (!scriptElement) return widgetStyles.floating;
        const displayType = scriptElement.getAttribute("data-display");
        if (!displayType || displayType.trim().length === 0) return widgetStyles.floating;
        if ([widgetStyles.fullscreen, widgetStyles.inline, widgetStyles.floating].includes(displayType)) {
            return displayType;
        }
        return widgetStyles.floating;
    }

    function initializePageView() {
        let lastPageview = parseInt(localStorage.getItem(cookieNames.LAST_PAGEVIEW), 10) || null;
        if (!lastPageview) {
            isReturnUser = false;
        } else {
            const currentTime = Math.floor(Date.now() / 1000);
            isReturnUser = currentTime - lastPageview >= 10800;
        }
        const currentTime = Math.floor(Date.now() / 1000);
        localStorage.setItem(cookieNames.LAST_PAGEVIEW, currentTime);
    }

    
    initializePageView();
    initializeWidget();

    
    window.addEventListener("message", (event) => {
        const eventData = event.data;
        if (eventData === "chat_minimized") {
            hideChatWidget();
        } else {
            const eventId = eventData?.event_id;
            if (!eventId) return;

            if (eventId === "new_chat") {
                const chatData = eventData?.data;
                if (chatData) {
                    saveChatSession(chatData.chat_gid, null);
                }
            } else if (eventId === "chat_created") {
                const chatData = eventData?.data;
                if (chatData) {
                    saveChatSession(chatData.chat_id);
                }
            } else if (eventId === "customer_info_collected") {
                const customerData = eventData?.data?.customer;
                if (customerData) {
                    saveDataToLocalStorage(customerData);
                }
            } else if (eventId === "loaded") {
                if (iframeElement) {
                    if (!getCustomerIdCookie()) {
                        postMessageToIframe({ event_id: "customer_load", cust: getCustomerIdCookie(), custgid: null });
                    }
                    if (isMobileView()) {
                        postMessageToIframe({ event_id: "is_mobile", window_width: window.innerWidth });
                    }
                    if (getChatSessions().length > 0) {
                        postMessageToIframe({
                            event_id: "conversation_history",
                            lcg: getCustomerIdCookie(),
                            messages: getChatSessions()
                        });
                    }
                }
            } else if (eventId === "chat_cleared") {
                clearChatSessions();
            } else if (eventId === "chatbot_loaded") {
                if (widgetDisplayType === widgetStyles.fullscreen || widgetDisplayType === widgetStyles.inline) {
                    showChatWidget();
                } else {
                    handleAutoOpen();
                }
            }
        }
    });

})();
