/*
    Widget Loader (version 1.3.1)

    Copyright 2008 Huangchao.

    This file is part of LeafLife.

    LeafLife is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License version 2 as
    published by the Free Software Foundation.

    LeafLife is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with LeafLife. If not, see <http://www.gnu.org/licenses/>.
*/
(function()
{
    var doc = document, platform;
    if (typeof leaflife == "undefined")
    {
        // browser detect
        platform = -[1,] ? 0 : 1;  // the browser type ([1,] is NaN in IE, while 1 in other browsers)

        // native extention
        String.prototype.trim = function()
        {
            return this.replace(/(^\s+)|(\s+$)/g, '');
        };
        String.prototype.capitalize = function()
        {
            return this.replace(/^[a-z]/, function(a)
            {
                return a.toUpperCase();
            });
        };
    
        Function.prototype.hook = function(thisObj, arg1, arg2, arg3, arg4, arg5)
        {
            var method = this;
            return function()
            {
                method.call(thisObj, arg1, arg2, arg3, arg4, arg5);
            };
        };

        doc.getWidgetById = function(name)
        {
            return leaflife.widgets["_" + name];
        };
        doc.removeWidgetById = function(name)
        {
            var widgets = leaflife.widgets, widget = widgets["_" + name];
            if (widget)
            {
                widget.destructor(true);
                leaflife.removeWidget(widget);
            }
        };

        leaflife =
        {
            platform: platform,  // the browser type
            loaded: [],  // [widget name]
            widgets: [],  // [widget] and <_ + widget name, widget>
            listeners: {},  // <event type, [widget object]>
            contentContainers: [],  // root content containers: [element]
            langs: {},
            classContext: {},  // <class name (full), context path>
            classes: {},  // <class name (full/simple), <method name, function>>
            context: [],  // the clone or serialization context, [object/array]
            MAX_LEVEL: 8,  // the max level
            typePattern: /^\s?function (.+)\(\) \{\s*\[native code\]\s*\}\s?$/,
            styles: {},  // the style sheets of widget

            // widget management
            addWidget: function(widget, name)
            {
                var widgets = this.widgets, id = widgets.length, internName;
                if (name)
                {
                    internName = '_' + name;
                    if (widgets[internName])  // the name is already used by other widget
                    {
                        throw new Error("The widget name (" + name + ") is already been used");
                    }
                    widgets[internName] = widget;
                }
                widgets[id] = widget;
                return id;
            },
            removeWidget: function(widget, name)
            {
                var widgets = this.widgets, i = widgets.length - 1;
                for (; i > -1; -- i)
                {
                    if (widgets[i] === widget)
                    {
                        widgets.splice(i, 1);
                        break;
                    }
                }
                if (name)
                {
                    delete widgets['_' + name];
                }
            },
            extend: function(subClass, superClass)
            {
                if (typeof subClass != "function" || typeof superClass != "function")
                {
                    throw new Error("The class is not function");
                }
                var obj = subClass.prototype = new superClass();
                obj.constructor = subClass;
                obj.superClass = superClass.prototype;
                obj["super"] = obj;
            },

            setConfig: function(widgetObj, config)
            {
                for (var i in config)
                {
                    if (config.hasOwnProperty(i) && typeof widgetObj[i] != "undefined")
                    {
                        widgetObj[i] = config[i];
                    }
                }
            },

            // event process
            initEvent: function(widgetObj, eventTypes)
            {
                widgetObj.listeners = {};  // <event type, [listener function]>
                if (eventTypes)
                {
                    widgetObj.eventTypes = eventTypes;
                }
                var proto = window[widgetObj["class"]].prototype;
                if (! proto.fireEvent)
                {
                    proto.setEvent = this.setEventImpl;
                    proto.addEventListener = this.addEventListenerImpl;
                    proto.removeEventListener = this.removeEventListenerImpl;
                    proto.fireEvent = this.fireEventImpl;
                }
            },
            // @param config: the event processors {event name (include the prefix "on"), function}
            setEventImpl: function(config)  // private
            {
                if (config)
                {
                    var eventTypes = this.eventTypes, i = eventTypes.length - 1, eventType, processor;
                    for (; i > -1; -- i)
                    {
                        eventType = eventTypes[i];
                        if ((processor = config[eventType]) && typeof processor == "function")  // the event is supported
                        {
                            this[eventType] = processor;
                        }
                    }
                }
            },
            // The listener doesn't cancel the event even if it return false
            // @param eventType: event name (without "on")
            // @param listener: listener function
            // @return false if the listener is duplicated
            addEventListenerImpl: function(eventType, listener)  // private
            {
                var listeners = this.listeners, events = listeners[eventType], i = 0, func;
                if (events)
                {
                    // filter the duplicated listener
                    while (func = events[i])
                    {
                        if (listener == func)  // exclude duplicate listeners
                        {
                            return;
                        }
                        ++ i;
                    }
                }
                else
                {
                    events = listeners[eventType] = [];
                }
                events[i] = listener;
            },
            // @param eventType: event name (without "on")
            // @param listener: listener function
            removeEventListenerImpl: function(eventType, listener)  // private
            {
                var events = this.listeners[eventType], i;
                if (events)
                {
                    for (i = events.length - 1; i > -1; -- i)
                    {
                        if (events[i] == listener)
                        {
                            events.splice(i, 1);
                        }
                    }
                }
            },
            fireEventImpl: function(eventType, defaultVal, args, ignoreObj, eventObj)  // private
            {
                var processor = this["on" + eventType], listeners = this.listeners[eventType], result, size, i;
                args = args || [];
                if (! ignoreObj)
                {
                    args.splice(0, 0, this);
                }
                eventObj = eventObj || window;
                if (processor)
                {
                    try
                    {
                        result = processor.apply(eventObj, args);
                    }
                    catch (e)
                    {
                        throw new Error(this["class"] + " event (" + eventType + ") processor error: " + e.message);
                    }
                }
                if (listeners)
                {
                    size = listeners.length;
                    for (i = 0; i < size;)
                    {
                        try
                        {
                            listeners[i ++].apply(eventObj, args);
                        }
                        catch (e)
                        {
                            throw new Error(this["class"] + " event (" + eventType + ") listener error: " + e.message);
                        }
                    }
                }
                return result == undefined ? defaultVal : result;
            },
            // Add listener to the specified object
            // @param nav: the html element
            // @param eventType: the event name (without "on")
            // @param listener: the listener function
            // @param widget: the widget object (optional)
            addEventListener: function(nav, eventType, listener, widget)  // public
            {
                var eventName, body, pos, html;
                if (eventType === "visible")  // the special event (only trigger once)
                {
                    pos = nav.getBoundingClientRect();
                    if ((! pos.top && ! pos.left) || (! nav.offsetWidth && ! nav.offsetHeight))  // the element is invisible
                    {
                        if (this.platform)  // IE
                        {
                            body = document.body;
                            // find the parent element which display is none
                            while (nav != body)
                            {
                                if (nav.offsetWidth || nav.offsetHeight)  // the object is visible
                                {
                                    return false;
                                }
                                if (nav.style.display == "none")  // the object must be html element, otherwise error occurs
                                {
                                    break;
                                }
                                nav = nav.parentNode;
                            }
                            if (nav != body)  // the hidden element is found
                            {
                                eventName = "onpropertychange";
                            }
                            else if (body.offsetWidth || body.offsetHeight)  // the body is visible
                            {
                                return false;
                            }
                            else  // the body is invisible
                            {
                                eventName = "onresize";
                            }
                        }
                        else
                        {
                            eventName = "DOMAttrModified";
                        }
                        // attach the listener
                        this.attachHTMLListener(nav, eventName, this.onNavVisible.hook(this, nav, eventName), widget, listener);
                        return true;
                    }
                }
                else
                {
                    if (nav.addEventListener)  // w3c dom browsers or widget object
                    {
                        nav.addEventListener(eventType, listener, false);
                    }
                    else if (this.platform)  // IE
                    {
                        eventName = "on" + eventType;
                        if (nav == document.body && widget)  // the body
                        {
                            this.attachHTMLListener(this, eventName, this.onBodyEvent, widget, listener);  // attach the html event listener
                        }
                        else if (nav.attachEvent)
                        {
                            nav.attachEvent(eventName, listener);
                        }
                    }
                }
            },
            attachHTMLListener: function(nav, eventName, htmlListener, widget, widgetListener)  // IE private
            {
                var listeners = this.listeners, events = listeners[eventName], i = 0, size;
                if (! events)  // the html event listener is not attached
                {
                    events = listeners[eventName] = [];
                    if (nav.attachEvent)  // IE
                    {
                        nav.attachEvent(eventName, htmlListener);  // attach the html event listener
                    }
                    else
                    {
                        nav.addEventListener(eventName, htmlListener, false);
                    }
                }
                widget.addEventListener(eventName, widgetListener);
                size = events.length;
                for (; i < size;)
                {
                    if (events[i ++] == widget)
                    {
                        return;
                    }
                }
                events[size] = widget;
            },
            onBodyEvent: function()  // IE private
            {
                var eventName = "on" + event.type, widgets = this.listeners[eventName], size, i;
                if (widgets)
                {
                    size = widgets.length;
                    for (i = 0; i < size; ++ i)
                    {
                        widgets[i].fireEvent(eventName);
                    }
                }
            },
            onNavVisible: function(nav, eventName)  // private
            {
                var container = nav == window ? document.body : nav, func;
                if (container.offsetWidth || container.offsetHeight)  // the html element is visible
                {
                    func = arguments.callee.caller;
                    if (nav.attachEvent)  // IE
                    {
                        nav.detachEvent(eventName, func);
                    }
                    else
                    {
                        nav.removeEventListener(eventName, func, false);
                    }
                    // fire listeners
                    var listeners = this.listeners, widgets = listeners[eventName], widget, i;
                    if (widgets)
                    {
                        for (i = widgets.length - 1; i > -1; -- i)
                        {
                            widget = widgets[i];
                            widget.fireEvent(eventName, null, null, true, widget);
                        }
                    }
                    delete listeners[eventName];
                }
            },
            delayRender: function(nav, widget, func)
            {
                if (nav)
                {
                    if (! this.addEventListener(nav, "visible", func, widget))
                    {
                        func.apply(widget);
                    }
                }
            },
            // Attach the event function with the target widget. Make the correspond event of owner widget is fired when the target widget event fired
            // @param widgetObj: the target widget object
            // @param events: the event name list
            associateEvents: function(widgetObj, events)
            {
                var i = events.length - 1, name;
                for (; i > -1; -- i)
                {
                    name = events[i];
                    widgetObj[name] = Function("var a=arguments,p=[].slice.call(a,1),w=a[0].getOwnerWidget();return w.fireEvent.apply(w,['" + name.substring(2) + "',null,p]);");
                }
            },

            // widget content container show/hide
            showContentContainer: function(containerNav, thisWidget)
            {
                var body = document.body, contentContainers = this.contentContainers, nav = containerNav.parentNode, widgetObj, index;
                // hook this widget with the parent widget
                while (nav != body)
                {
                    if ((widgetObj = nav.widgetObj) && widgetObj["class"])
                    {
                        widgetObj.innerWidgetObj = thisWidget;
                        index = nav.style.zIndex + 1;  // increase the z-index
                        break;
                    }
                    nav = nav.parentNode;
                }
                if (nav == body)  // can not found the parent selectbox
                {
                    contentContainers[contentContainers.length] = containerNav;  // register this content container as the root content container
                    containerNav.rootContentContainer = 1;
                    index = 2;
                }
                containerNav.style.zIndex = index;
            },
            hideContentContainer: function(containerNav, thisWidget)
            {
                var parentWidget = thisWidget, widgetObj;
                while (widgetObj = parentWidget.innerWidgetObj)
                {
    //Log.value = widgetObj["class"] + "\n" + Log.value;
                    parentWidget.innerWidgetObj = null;
                    widgetObj.hideContentContainer();  // hide the inner content container
                    parentWidget = widgetObj;
                }
                if (containerNav.rootContentContainer)  // unregister this content container with the root container list
                {
                    var contentContainers = this.contentContainers, i = contentContainers.length - 1;
                    for (; i > -1; -- i)
                    {
                        if (contentContainers[i] == containerNav)
                        {
                            contentContainers.splice(i, 1);
                            break;
                        }
                    }
                    containerNav.rootContentContainer = 0;
                }
                containerNav.style.zIndex = 0;  // restore the z-index
            },
            hideContentContainers: function()
            {
                var contentContainers = this.contentContainers, i = contentContainers.length - 1;
                for (; i > -1; -- i)
                {
                    contentContainers[i].widgetObj.hideContentContainer(true);
                }
            },
            hideContentContainerOnDocument: function(event)
            {
                if (leaflife.contentContainers.length)
                {
                    //doc.elementFromPoint(event.clientX, event.clientY)
                    event = event || window.event;
                    var doc = document, body = doc.body, activeNav = event.srcElement || event.target, nav = activeNav, widgetObj;
                    if (body.componentFromPoint && body.componentFromPoint(event.clientX, event.clientY).indexOf("scrollbar"))  // mouse is not click on the scrollbar
                    {
                        // find the parent content container opened
                        while (nav != body)
                        {
                            if ((widgetObj = nav.widgetObj) && widgetObj["class"])  // the active element is within the content container
                            {
                                if (widgetObj = widgetObj.innerWidgetObj)
                                {
                                    widgetObj.hideContentContainer(true);  // close all inner content containers
                                }
                                return;
                            }
                            nav = nav.parentNode;
                        }
                        if (nav && nav == body)  // close all root content containers
                        {
                            leaflife.hideContentContainers();
                        }
                    }
                }
            },

            // widget mask layer
            showMask: function(opacity, color)
            {
                var maskNav = this.maskNav, doc = document, body = doc.body, style;
                if (! maskNav)
                {
                    this.maskNav = maskNav = body.appendChild(doc.createElement("div"));
                    style = maskNav.style;
                    style.backgroundColor = color || "#FFF";
                    style.opacity = opacity = opacity || 0;
                    style.filter = "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + opacity + ")";
                    style.position = "absolute";
                    style.left = style.top = 0;
                    style.zIndex = 1000;
                    this.addEventListener(window, "resize", function()
                    {
                        var style = leaflife.maskNav.style;
                        if (! style.display)
                        {
                            style.display = "none";
    //alert(body.scrollWidth + ", " + body.scrollHeight);
                            setTimeout(leaflife.resizeMask, 3);
                        }
                    });
                }
                this.resizeMask();
            },
            resizeMask: function()
            {
                var style = this.maskNav.style, body = document.body;
                style.width = body.scrollWidth;
                style.height = body.scrollHeight;
                style.display = "";
            },
            hideMask: function()
            {
                var maskNav = this.maskNav;
                if (maskNav)
                {
                    maskNav.style.display = "none";
                }
            },

            // widget user-defined data
            initData: function(proto)
            {
                if (! proto.getData)
                {
                    proto.getData = this.getDataImpl;
                    proto.setData = this.setDataImpl;
                }
            },
            getDataImpl: function(key)  // private
            {
                var data = this.data;
                return key && typeof data == "object" ? data[key] : data;
            },
            setDataImpl: function(val, key)  // private
            {
                if (key)
                {
                    if (! this.data)
                    {
                        this.data = {};
                    }
                    this.data[key] = val;
                }
                else
                {
                    this.data = val;
                }
            },

            // widget locale language support
            setLocaleLang: function(widgetName, definition)
            {
                this.langs[widgetName] = definition;
            },
            loadLocaleLang: function(widgetName)
            {
                var type = window[widgetName].prototype, definition = this.langs[widgetName], i;
                if (definition)
                {
                    for (i in definition)
                    {
                        if (definition.hasOwnProperty(i))
                        {
                            type[i] = definition[i];
                        }
                    }
                }
            },

            // remote class import
            importClass: function(className, methods, simpleName, contextPath)
            {
                var prototypeObj = {}, classes = this.classes, i = methods.length - 1, methodName;
                for (; i > -1; -- i)
                {
                    methodName = methods[i];
                    prototypeObj[methodName] = Function("var a=[].slice.call(arguments,0);a.splice(0,0,'" + methodName + "');return this._$_.invoke.apply(this._$_,a);");
                }
                if (! classes[className])
                {
                    classes[className] = prototypeObj;
                    // set the simple class name (set null if duplicated)
                    classes[simpleName] = typeof classes[simpleName] != "undefined" ? null : className;
                    // set the context path if the request is cross-domained
                    if (contextPath)
                    {
                        this.classContext[className] = contextPath;
                    }
                }
            },

            // widget clone and serialization
            clone: function(obj)
            {
                var context = this.context, level = context.length;
                // check the clone level
                if (level > this.MAX_LEVEL)  // stop clone if it reaching the max clone level
                {
                    return null;
                }
                else  // continue clone
                {
                    context[level] = obj;
                }
                var constructor = obj.constructor, objCloned = constructor == Object ? new constructor() : new constructor(obj.valueOf()), k, v;
                for (k in obj)
                {
                    v = obj[k];
                    if (obj.hasOwnProperty(k))
                    {
                        objCloned[k] = typeof v == "object" ? this.clone(v) : v;
                    }
                }
                -- context.length;
                return objCloned;
            },

            parseJSON: function(json)
            {
                if (typeof json == "string")
                {
/*
                    // deprecated because JSON.parse is not support expression (eg. new Date())
                    if (typeof JSON != "undefined" && typeof JSON.parse == "function")
                    {
                        return JSON.parse(json);
                    }
*/
                    return (new Function("return " + json))();
                }
                return json;
            },
            toJSONString: function(obj, standard)
            {
                if (obj == undefined)
                {
                    return "null";
                }
                var context = this.context, level = context.length, result, val, size, matched, i;
                try
                {
                    // the javascript build-in object
                    matched = obj.constructor.toString().match(this.typePattern);
                }
                catch (e)  // the object constructor is undefined when it is setted from the other window and the window is closed
                {
                    throw new Error("the object is reclaimed by browser");
//                    if (typeof obj == "object" && typeof obj.length == "number" && ! obj.propertyIsEnumerable("length"))  // array
                }
                if (matched)
                {
                    matched = matched[1];  // the object type
                    if (matched == "String")
                    {
                        // replace control characters, quote characters, and backslash characters with safe sequences
                        if (/["\\\x00-\x1f&=+%]/.test(obj))  // character substitutions
                        {
                            obj = obj.replace(/["\\\x00-\x1f&=+%]/g, function(a)
                            {
                                var m =
                                {
                                    '\b': "\\b",
                                    '\t': "\\t",
                                    '\n': "\\n",
                                    '\f': "\\f",
                                    '\r': "\\r",
                                    '"' : "\\\"",
                                    '\\': "\\\\"
                                }, c;
                                if (c = m[a])
                                {
                                    return c;
                                }
                                c = a.charCodeAt();
                                return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
                            });
                        }
                        return '"' + obj + '"';
                    }
                    else if (matched == "Number")
                    {
                        return isFinite(obj) ? "" + obj : null;  // encode non-finite numbers as null
                    }
                    else if (matched == "Boolean")
                    {
                        return "" + obj;
                    }
                    else if (matched == "Array")
                    {
                        // check the serialization level
                        if (level > this.MAX_LEVEL)  // stop serialization if reaching the max serialization level
                        {
                            return null;
                        }
                        else  // continue serialization
                        {
                            context[level] = obj;
                        }
                        size = obj.length;
                        result = [];
                        for (i = 0; i < size;)
                        {
                            val = obj[i ++];
                            if (typeof val != "function")  // ignore function value
                            {
                                try
                                {
                                    if (val = this.toJSONString(val, standard))
                                    {
                                        result[result.length] = val;
                                    }
                                }
                                catch (e)
                                {
                                }
                            }
                        }
                        // remove the context after serialization
                        -- context.length;
                        return '[' + result.join(',') + ']';
                    }
                    else if (matched == "Date")
                    {
                        val = obj.getTime();
                        return standard ? "new Date(" + val + ")" : '@' + val;
                    }
                    else if (matched == "RegExp")
                    {
                        return '/' + obj.source + '/' + (obj.ignoreCase ? 'i' : '') + (obj.multiline ? 'm' : '');
                    }
                    else if (matched == "Error")
                    {
                        return "new Error(" + this.toJSONString(obj.message) + ")";
                    }
                }
                // serialize the object
                if (level > this.MAX_LEVEL)  // stop serialization if reaching the max serialization level
                {
                    return null;
                }
                else if (typeof obj.toJSONString === "function")  // using customary serialization function if available
                {
                    return obj.toJSONString.apply(obj, [].slice.call(arguments, 1));
                }
                else  // continue serialization
                {
                    context[level] = obj;
                }
                result = [];
                if (val = obj["class"])  // serialize the 'class' property first
                {
                    result[result.length] = '"class":"' + val + '"';
                }
                for (i in obj)
                {
                    if (typeof i === "string" && i != "class")
                    {
                        val = obj[i];
                        if (typeof val != "function")  // ignore function value
                        {
                            try
                            {
                                if (val = this.toJSONString(val, standard))
                                {
                                    result[result.length] = this.toJSONString(i, standard) + ':' + val;
                                }
                            }
                            catch (e)
                            {
                            }
                        }
                    }
                }
                // remove the context after serialization
                -- context.length;
                return '{' + result.join(',') + '}';
            },

            // style management
            addStyle: function(nav, style)
            {
                if (nav && style && ! RegExp("\\b" + style + "\\b").test(nav.className))
                {
                    nav.className += ' ' + style;
                }
            },
            resetStyle: function(nav, style, newStyle)
            {
                if (nav)
                {
                    if (style)
                    {
                        nav.className = nav.className.replace(RegExp("\\s\\b" + style + "\\b"), newStyle ? " " + newStyle : "");
                    }
                    else  // no style specified
                    {
                        this.addStyle(nav, newStyle);  // add new style
                    }
                }
            },
            setTheme: function(theme)
            {
                if (theme && theme != this.theme)
                {
                    this.theme = theme;
                    var styles = this.styles, rootPath = this.rootPath, widgetObj, i;
                    for (i in styles)
                    {
                        widgetObj = widgetConfig[i];
                        styles[i].href = rootPath + widgetObj.path + "themes/" + theme + "/default.css";
                    }
                }
            },
    //        applyStyleRules: function(containerId)
    //        {
    //            var styleSheetObj = document.getElementById("leaflife-style-" + containerId);
    //            if (this.platform)  // IE
    //            {
    //                var styles = [], rules = styleSheetObj.rules, ruleSize = rules.length, i = 0;
    //                for (; i < ruleSize; ++ i)
    //                {
    //                    styles[i] = '#' + containerId + ' ' + rules[i].selectorText + '{' + rules[i].style.cssText + '}';
    //                }
    //                styleSheetObj.cssText = styles.join('');
    //            }
    //        },

            loadScript: function(url, doc, container)
            {
                doc = doc || document;
                container = container || doc.documentElement.firstChild;
                var elem = container.appendChild(doc.createElement("script"));
                elem.language = "javascript";
                elem.charset = "UTF-8";
                elem.src = url;
            },

            destructor: function()  // release memory (to prevent from leak)
            {
                var widgets = leaflife.widgets, loaded = leaflife.loaded, widgetObj, i;
                if (widgets)
                {
                    for (i = widgets.length - 1; i > -1; -- i)  // destruct all widget objects
                    {
                        if (widgetObj = widgets[i])
                        {
                            widgetObj.destructor();
                        }
                    }
                }
                leaflife.widgets = leaflife.listeners = leaflife.styles = leaflife.contentContainers = leaflife.maskNav = null;
                for (i = loaded.length - 1; i > -1; -- i)  // destruct all static objects
                {
                    if ((widgetObj = window[loaded[i]]) && widgetObj.destructor)
                    {
                        widgetObj.destructor();
                    }
                }
                // release the function reference
                delete Function.prototype.hook;
            },

            // utility
            getClientX: function(srcNav, tgtNav)
            {
                return srcNav.getBoundingClientRect().left - (tgtNav ? tgtNav.getBoundingClientRect().left : 0);
            },
            getClientY: function(srcNav, tgtNav)
            {
                return srcNav.getBoundingClientRect().top - (tgtNav ? tgtNav.getBoundingClientRect().top : 0);
            },
            getOffsetX: function(nav)
            {
                var bodyNav = document.body;
                return nav.getBoundingClientRect().left + bodyNav.scrollLeft - bodyNav.clientLeft;
            },
            getOffsetY: function(nav)
            {
                var bodyNav = document.body;
                return nav.getBoundingClientRect().top + bodyNav.scrollTop - bodyNav.clientTop;
            },
            dependence:
            {
                Tree:               ["Map"]
            }
        };
        leaflife.addEventListener(doc, "mousedown", leaflife.hideContentContainerOnDocument);

        // the widget information
        leaflife.widgetConfig =
        {
            Map:                {version: "1.0.19", path: "common/",            file: "map.js"},
            RemoteDataSource:   {version: "0.2.6",  path: "common/",            file: "remotedatasource.js"},
            Tree:               {version: "1.3.13", path: "tree/",              file: "tree" + platform + ".js",            theme: "default"}
        };
    }

    var head = doc.documentElement.firstChild, scriptNavs = doc.getElementsByTagName("script"), idx, scriptNav, scriptSrc, navs, nav, i;
    if (leaflife.platform)  // IE
    {
        doc.execCommand("BackgroundImageCache", false, true);  // enable IE's background image cache
        window.attachEvent("onunload", leaflife.destructor);
        leaflife.cancelEvent = function()
        {
            event.cancelBubble = true;
            event.returnValue = false;
        };
        // IE version detect
        nav = doc.createElement("div");
        navs = nav.childNodes;
        i = 4;
        while (nav.innerHTML = "<!--[if gt IE " + (++ i) + "]>0<![endif]-->", navs.length);
        leaflife.version = i;
    }
    else  // other browser
    {
        window.addEventListener("unload", leaflife.destructor, false);
        leaflife.cancelEvent = function(event)
        {
            event.preventDefault();
            event.stopPropagation();
        };
    }
    for (i = scriptNavs.length - 1; i > -1; -- i)
    {
        scriptNav = scriptNavs[i];
        scriptSrc = scriptNav.src;
        if (scriptSrc && (idx = scriptSrc.search(/\bwidget\.js\b/)) > -1)
        {
            var contextPath = (scriptNav.getAttribute("contextPath") || "").trim(), rootPath = leaflife.rootPath = scriptSrc.substring(0, idx), theme = leaflife.theme = scriptNav.getAttribute("theme") || "default", styles = leaflife.styles, lang = navigator.systemLanguage, loaded = leaflife.loaded, widgetConfig = leaflife.widgetConfig, dependence = leaflife.dependence, imports = {}, jsList = [], name, widgetList, widgetObj, widgetPath, jsDepList, elem, size, j, k;
            if (contextPath)  // the context path is within the current url
            {
                if (! contextPath.indexOf("/"))  // the ip address is missing
                {
                    leaflife.contextPath = contextPath;  // the default context path
                }
                else
                {
                    name = location.host;
                    idx = contextPath.indexOf(name);
                    if (idx > -1)  // the local ip address is specified
                    {
                        contextPath = contextPath.substring(idx + name.length);
                    }
                    else if (contextPath.indexOf("http://"))
                    {
                        contextPath = "http://" + contextPath;
                    }
                }
            }
            if (name = scriptNav.getAttribute("imports"))  // the widget name imported
            {
                widgetList = name.split(",");
                size = widgetList.length - 1;
                while (name = widgetList[size])
                {
                    widgetList.length = size;
                    name = name.capitalize();  // change the first character to upper case
                    name = name.trim();
                    if (! window[name] && ! imports[name])
                    {
                        imports[name] = 1;
                        jsList[jsList.length] = name;
                        if (jsDepList = dependence[name])
                        {
                            widgetList = widgetList.concat(jsDepList);
                            size += jsDepList.length;
                        }
                    }
                    -- size;
                }
                // import files
                for (j = jsList.length - 1; j > -1; -- j)
                {
                    name = jsList[j];
                    if (widgetObj = widgetConfig[name])
                    {
                        loaded[loaded.length] = name;
                        widgetPath = rootPath + widgetObj.path;
                        // import the javascript file
                        leaflife.loadScript(widgetPath + widgetObj.file + "?ver=" + widgetObj.version, doc, head);
                        // import the language file
                        if (widgetObj.lang)
                        {
                            leaflife.loadScript(widgetPath + "lang/" + lang + ".js?ver=" + widgetObj.version, doc, head);
                        }
                        // import the css file
                        if (size = widgetObj.theme)
                        {
                            head.appendChild(elem = styles[name] = doc.createElement("link"));
                            elem.rel = "stylesheet";
                            elem.href = widgetPath + "themes/" + theme + "/" + size + ".css";
                        }
                    }
                }
                // import the remote java stubs
                if (name = scriptNav.getAttribute("classes"))
                {
                    elem = doc.createElement("script");
                    head.appendChild(elem);
                    elem.src = contextPath + "/JSRPCService?Import=" + name + "&ContextPath=" + encodeURIComponent(contextPath);
                }
            }
            break;
        }
    }
}
)();
