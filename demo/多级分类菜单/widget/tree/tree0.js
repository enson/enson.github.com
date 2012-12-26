/*
    Tree Widget for Mozilla Firefox (version 1.3.13)

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
/******************************************************************************
 * Tree Definition
 *****************************************************************************/
function Tree(config)
{
    var proto = Tree.prototype, configs = Tree.configurations, val, rootNode, methods, i;
    config = config || {};
    leaflife.addWidget(this, config.id);
    // configurations
    leaflife.initEvent(this, ["onbeforeload", "onafterload", "onbeforeinsert", "onafterinsert", "onclickhierarchy", "onclickicon", "onclickprefix", "onclicknode", "ondblclicknode", "onrightclicknode", "onbeforeselectchange", "onafterselectchange", "onbeforecheckchange", "onaftercheckchange", "onexpand", "oncollapse", "ondragstart", "ondragging", "ondrop", "onmove", "oncopy", "onbeforeedit", "onafteredit", "oncompare", "onbeforeremove", "onafterremove", "oncascadecheckchange"]);
    this.setEvent(config);
    leaflife.setConfig(this, config);
    // root node
    this.rootNode = rootNode = new TreeNode();
    rootNode.treeObj = this;
    this.nodeMap = {};  // <node id, TreeNode>
    this.nodeSelected = new Map();  // <node name, TreeNode>
    this.nodeChecked = new Map();  // <node name, TreeNode>
    this.nodeCheckedPartial = new Map();  // <node name, TreeNode>
    this.nodeRadioed = new Map();  // <node name, TreeNode>
    if (! Tree.nodesLazyCheck)
    {
        Tree.nodesLazyCheck = new Map();  // <node name, TreeNode>
    }
    // define getter methods
    if (! proto.getId)
    {
        leaflife.initData(proto);
        proto.oncompare = Tree.defaultComparator;  // the default comparator
        methods = ["getId", "isAutoWrap", "isHierarchyVisible", "isNodeIconVisible", "getPrefix", "getCheckCascade", "getRadioGroup", "isExpandAllOnload", "isAutoSort", "getWidth", "getHeight", "isDraggable", "getDropEffect", "getTarget", "getStyle", "getContainer", "getSelectionMode", "getRecheckOnload", "isAutoCollapse", "isEditable", "getDataSource"];
        for (i = 20; i > -1; -- i)
        {
            proto[methods[i]] = Function("return this." + configs[i]);
        }
        proto = TreeNode.prototype;
        leaflife.initData(proto);
        methods = ["getId", "getText", "getIconStyleInactive", "getIconStyleActive", "getPrefix", "getTextStyle", "getHref", "getTarget", "getHint", "getOrderIndex", "getLevel", "getOwnerTree"];
        configs = TreeNode.configurations;
        for (i = 11; i > -1; -- i)
        {
            proto[methods[i]] = Function("return this." + configs[i]);
        }
    }
}

Tree.sequence = 0;
Tree.configurations = ["id", "autoWrap", "hierarchyVisible", "nodeIconVisible", "prefix", "checkCascade", "radioGroup", "expandAllOnload", "autoSort", "width", "height", "draggable", "dropEffect", "target", "style", "container", "selectionMode", "recheckOnload", "autoCollapse", "editable", "dataSource"];

Tree.prototype =
{
    // private
    "class": "Tree",
    dataProviderClass: "leaflife.widget.tree.data.TreeDataProvider",
    dataSourceClass: "leaflife.widget.tree.data.TreeDataSource",
    // public
    id: "",
    hierarchyVisible: true,
    nodeIconVisible: true,
    prefix: "none",  // none/checkbox/radio/...
    checkCascade: "three-state",  // none/two-state/three-state
    radioGroup: "all",  // all/children
    expandAllOnload: false,
    autoSort: false,
    autoWrap: false,
    width: "",
    height: "",
    style: "",
    draggable: false,
    dropEffect: "none",  // none/move/copy
    target: "_self",
    container: "",
    selectionMode: "single",  // single/multiple
    recheckOnload: "old",  // new/old/none (validate nodes' checkbox/radiobox by loaded/existed node)
    autoCollapse: false,
    editable: false,
    dataSource: null,
    data: null,
    ownerWidget: null,

    render: function(container, doc)
    {
        var rootNode = this.rootNode, ownerWidget = this.ownerWidget;
        if (! this.rendered)
        {
            doc = this.doc = doc || document;
            container = container || this.container || (ownerWidget ? ownerWidget.container : doc.body);
            if (typeof container == "string")  // get the container element
            {
                container = doc.getElementById(container);
            }
            if (this.container = container)
            {
                this.draw();
            }
        }
        rootNode.expand(this.expandAllOnload);
        rootNode.expanded = true;
    },

    draw: function()
    {
        var doc = this.doc, rootNav = this.rootNav = this.container.appendChild(doc.createElement("div")), size;
        rootNav.id = "leaflife-tree-" + Tree.sequence ++;
        rootNav.className = "tree " + this.style;
        if (size = this.width)
        {
            rootNav.style.width = size;
        }
        if (size = this.height)
        {
            rootNav.style.height = size;
        }
        this.rendered = true;
    },

    setConfig: function(config)  // public
    {
        if (config)
        {
            // configurations
            var configurations = Tree.configurations, i = 20, item, val;
            for (; i > 15; -- i)  // selectionMode - dataSource
            {
                item = configurations[i];
                val = config[item];
                if (val != undefined)
                {
                    this[item] = val;
                }
            }
            this.setEvent(config);
        }
    },

    cancelEdit: function()
    {
        var funcEdit = this.funcEdit, txtbox = Tree.txtbox;
        if (funcEdit)
        {
            this.funcEdit = null;
            clearTimeout(funcEdit);
            if (txtbox && txtbox.style.display == "")
            {
                txtbox.blur();
            }
        }
    },

    refreshDataSource: function(parameters)
    {
        this.rootNode.refreshDataSource(parameters);
    },

    loadJSON: function(json)  // public
    {
        this.rootNode.loadJSON(json);
    },

    toJSONString: function()
    {
        var children = this.rootNode.children, result = [], i = 0;
        for (; i < children.length; ++ i)
        {
            result[i] = children[i].toJSONString(true);
        }
        return '[' + result.join(',') + ']';
    },
/*
    loadXML: function(xml)
    {
        this.rootNode.loadXML(xml);
    },
*/
    reload: function()
    {
        this.rootNode.reload();
    },

    unselectAll: function()
    {
        this.nodeSelected.invoke(TreeNode.prototype.unselect);
    },

    uncheckAll: function()
    {
        this.nodeChecked.invoke(TreeNode.prototype.setCheckState, 0);
        this.nodeCheckedPartial.invoke(TreeNode.prototype.setCheckState, 0);
        this.nodeRadioed.invoke(TreeNode.prototype.setCheckState, 0);
    },

    clear: function()
    {
        this.rootNode.removeChildren();
    },

    getRootNodes: function()
    {
        return this.rootNode.children;
    },

    appendRoot: function(node)
    {
        this.rootNode.insert(node, "lastChild");
    },

    attachNode: function(nodeObj)  // private
    {
        var id = nodeObj.id;
        if (id)
        {
            var nodeMap = this.nodeMap, nodes = nodeMap[id];
            if (! nodes)
            {
                nodes = nodeMap[id] = [];
            }
            nodes[nodes.length] = nodeObj;
        }
    },

    getNodeById: function(nodeName)
    {
        var nodes = this.nodeMap[nodeName];
        return nodes ? nodes[0] : null;
    },

    getNodesById: function(nodeName)
    {
        return this.nodeMap[nodeName];
    },

    getNodesSelected: function()
    {
        return this.nodeSelected.values();
    },

    getNodesChecked: function()
    {
        return this.nodeChecked.values();
    },

    getNodesCheckedPartial: function()
    {
        return this.nodeCheckedPartial.values();
    },

    getNodesRadioed: function()
    {
        return this.nodeRadioed.values();
    },

    destructor: function()
    {
        this.container = null;
        if (this.rendered)  // the tree is rendered
        {
            var container = this.container, dataSource = this.dataSource, navObj;
            if (navObj = Tree.dragHint)
            {
                Tree.dragHint = null;
                navObj.parentNode.removeChild(navObj);
            }
            if (navObj = Tree.droppableSibling)
            {
                Tree.droppableSibling = null;
                navObj.parentNode.removeChild(navObj);
            }
            if (dataSource)
            {
                dataSource.destructor();  // release the data source
            }
            Tree.txtbox = this.doc = this.funcTimeout = null;
            this.rootNode.destructor();
            container.parentNode.removeChild(container);
        }
    }
}

/******************************************************************************
 * Tree Events
 *****************************************************************************/
Tree.clickOnHierarchy = function(event)
{
    var nodeObj = this.nodeObj, treeObj = nodeObj.treeObj;
    treeObj.cancelEdit();
    if (treeObj.fireEvent("clickhierarchy", true, [nodeObj]) && nodeObj.children)
    {
        nodeObj.expanded ? nodeObj.collapse() : nodeObj.expand();
    }
}

Tree.selectByEvent = function(nodeObj, event)
{
    var multiSelect = event.ctrlKey && nodeObj.treeObj.selectionMode == "multiple";
    if (multiSelect && nodeObj.isSelected())
    {
        nodeObj.unselect();
    }
    else
    {
        nodeObj.select(multiSelect);
    }
}

Tree.clickOnIcon = function(event)
{
    var nodeObj = this.nodeObj, treeObj = nodeObj.treeObj;
    treeObj.cancelEdit();
    if (treeObj.fireEvent("clickicon", true, [nodeObj]))
    {
        Tree.selectByEvent(nodeObj, event);
    }
}

Tree.clickOnNode = function(event)
{
//alert("clickOnNode()");
    var nodeObj = this.nodeObj, treeObj = nodeObj.treeObj;
    if (! nodeObj.href)
    {
        leaflife.cancelEvent(event);
    }
    treeObj.cancelEdit();
    if (treeObj.editable && this.tagName == "A" && treeObj.nodeSelected.size() == 1 && treeObj.nodeSelected.containsKey(nodeObj.name))  // click on node text and show editbox
    {
        treeObj.funcEdit = setTimeout(TreeNode.prototype.edit.hook(nodeObj), 600);  // delay n seconds
    }
    else
    {
        if (treeObj.fireEvent("clicknode", true, [nodeObj]))
        {
            if (treeObj.autoCollapse)  // auto collapse sibling node
            {
                nodeObj.collapseSiblings();
            }
            nodeObj.expand();
        }
        Tree.selectByEvent(nodeObj, event);
    }
}

Tree.blurOnEditbox = function(event)
{
//alert("blurOnEditbox()");
    var nodeObj = this.previousSibling.nodeObj, treeObj = nodeObj.treeObj, keyCode = this.keyCode;
    this.keyCode = treeObj.funcEdit = null;
    this.style.display = "none";
    this.previousSibling.style.display = "";
    if (treeObj.fireEvent("afteredit", true, [nodeObj, this.value, keyCode == 13 ? "enter" : keyCode == 27 ? "esc" : "unknown"]))
    {
        nodeObj.setText(keyCode == 27 ? nodeObj.text : this.value);  // save changes if the "ESC" key is not pressed
    }
}

Tree.keyPressOnEditbox = function(event)
{
    var key = event.keyCode;
    if (key == 13 || key == 27)  // Enter or Esc
    {
        this.keyCode = key;
        this.blur();
    }
}

Tree.dblClickOnNode = function(event)
{
//alert("dblClickOnNode()");
    var nodeObj = this.nodeObj, treeObj = nodeObj.treeObj;
    treeObj.cancelEdit();
    treeObj.fireEvent("dblclicknode", true, [nodeObj]);
}

Tree.rightClickOnNode = function(event)
{
//alert("rightClickOnNode()");
    var nodeObj = this.nodeObj, treeObj = nodeObj.treeObj;
    if (! treeObj.fireEvent("rightclicknode", true, [nodeObj]))
    {
        leaflife.cancelEvent(event);
    }
}

Tree.clickOnPrefix = function(event)
{
    var nodeObj = this.nodeObj, treeObj = nodeObj.treeObj;
    treeObj.cancelEdit();
    if (treeObj.fireEvent("clickprefix", true, [nodeObj]) && nodeObj.checkState != undefined)
    {
        if ((nodeObj.prefix || treeObj.prefix) == "checkbox" && nodeObj.checkState == 1)
        {
            nodeObj.uncheck();
        }
        else
        {
            nodeObj.check();
        }
    }
}

Tree.getPageY = function(navObj)
{
    var result = 0;
    while (navObj)
    {
        result += navObj.offsetTop;
        navObj = navObj.offsetParent;
    }
    return result;
}

Tree.mouseDownOnNode = function(event)
{
    var nodeObj = this.nodeObj, treeObj = nodeObj.treeObj;
    leaflife.cancelEvent(event);
    treeObj.cancelEdit();
    if (treeObj.draggable && event.which == 1)  // left button
    {
        Tree.dragging = false;
        Tree.nodeDragged = nodeObj;
        treeObj.doc.onmouseup = Tree.mouseUpOnPage;
        treeObj.doc.onmousemove = Tree.mouseMoveOnPage;
    }
}

Tree.mouseMoveOnPage = function(event)
{
    var srcElem = event.target, dropEffect = srcElem.dropEffect, srcNode = Tree.nodeDragged, doc = srcNode.treeObj.doc, body = doc.body, dragHint = Tree.dragHint, dragStyle;
    if (dropEffect && dropEffect != "none")
    {
        var droppableSibling = Tree.droppableSibling, tgtNode, tgtTree, posPreviousSibling, linkObj;
        if (Tree.dragging)  // dragging
        {
            if (srcElem == droppableSibling)
            {
                srcElem.onmouseout = Tree.dragLeaveOnSibling;
            }
            else
            {
                if (srcElem.nodeObj)  // drag over on node
                {
                    tgtNode = srcElem.nodeObj, tgtTree = tgtNode.treeObj;
                    if (tgtNode.setDropEffect(event) != "none")
                    {
                        tgtNode.addTextStyle("treeDroppableText");
                        if (! (tgtTree.funcTimeout || tgtNode.expanded))
                        {
                            tgtTree.funcTimeout = setTimeout(TreeNode.prototype.expand.hook(tgtNode), 500);
                        }
                    }
                    srcElem.onmouseout = Tree.dragLeaveOnNode;
                }
                else  // drag over on td
                {
                    linkObj = srcElem.firstChild, tgtNode = linkObj.nodeObj, posPreviousSibling = event.pageY < Tree.getPageY(linkObj);
                    if (tgtNode.setDropEffect(event, posPreviousSibling) != "none")
                    {
                        tgtNode.treeObj.container.insertBefore(droppableSibling, posPreviousSibling ? tgtNode.navObj : tgtNode.navObj.nextSibling);
                        droppableSibling.style.display = "";
                    }
                    srcElem.onmouseout = Tree.dragLeaveOnSibling;
                }
            }
        }
        else  // start to drag
        {
            srcNode.select();  // select this node before dragging
            if (srcNode.treeObj.fireEvent("dragstart", true, [srcNode]))  // drag start
            {
                body.style.cursor = "no-drop";
                srcNode.addTextStyle("treeDraggedText");
                if (! droppableSibling)
                {
                    droppableSibling = Tree.droppableSibling = doc.createElement("div");
                    body.appendChild(droppableSibling);
                    droppableSibling.style.display = "none";
                    droppableSibling.className = "treeDroppableSibling";
                }
                if (! dragHint)
                {
                    dragHint = Tree.dragHint = doc.createElement("span");
                    body.appendChild(dragHint);
                    dragHint.style.display = "none";
                    dragHint.className = "treeDragHint";
                    dragHint.appendChild(doc.createTextNode(""));
                }
                droppableSibling.dropEffect = "none";
                dragHint.firstChild.nodeValue = srcNode.text;
                dragHint.style.display = "";
                Tree.dragging = true;
            }
        }
    }
    if (dragHint)
    {
        dragStyle = dragHint.style;
        dragStyle.left = event.clientX + body.scrollLeft + body.offsetLeft + 14;
        dragStyle.top = event.clientY + body.scrollTop + body.offsetTop + 4;
    }
}

Tree.dragLeaveOnNode = function(event)
{
    var srcElem = event.target, nodeObj = srcElem.nodeObj, tree = nodeObj.treeObj;
    srcElem.onmouseout = null;
    srcElem.style.cursor = "";
    nodeObj.removeTextStyle("treeDroppableText");
    clearTimeout(tree.funcTimeout);
    tree.funcTimeout = null;
}

Tree.dragLeaveOnSibling = function(event)
{
    var srcElem = event.target, evtTop = event.pageY, offsetTop = Tree.getPageY(srcElem), droppableSibling = Tree.droppableSibling;
    srcElem.onmouseout = null;
    srcElem.style.cursor = "";
    if (droppableSibling && evtTop != offsetTop - 1 && evtTop != offsetTop + srcElem.clientHeight)
    {
        droppableSibling.style.display = "none";
    }
}

Tree.mouseUpOnPage = function(event)
{
    var nodeDragged = Tree.nodeDragged, doc = nodeDragged.treeObj.doc;
    doc.onmouseup = doc.onmousemove = null;
    if (Tree.dragging)
    {
        var srcElem = event.target, defaultDropEffect = srcElem.dropEffect, dragHint = Tree.dragHint, droppableSibling = Tree.droppableSibling;
        doc.body.style.cursor = "";
        nodeDragged.removeTextStyle("treeDraggedText");
        dragHint.style.display = droppableSibling.style.display = "none";
        if (defaultDropEffect)
        {
            srcElem.style.cursor = "";
            if (droppableSibling.dropEffect != "none")
            {
                var tgtNode = srcElem.nodeObj, linkObj = srcElem.firstChild, position = "lastChild", dropEffect, newNode;
                if (tgtNode)  // drop on node
                {
                    Tree.dragLeaveOnNode(event);
                }
                else
                {
                    if (linkObj)  // drop on td
                    {
                        Tree.dragLeaveOnSibling(event);
                        tgtNode = linkObj.nodeObj;
                        position = event.pageY <= Tree.getPageY(tgtNode.linkObj) ? "previousSibling" : tgtNode.expanded ? "firstChild" : "nextSibling";
                    }
                    else  // drop on sibling hint
                    {
                        if (srcElem.nextSibling)
                        {
                            position = "previousSibling";
                            tgtNode = srcElem.nextSibling.nodeObj;
                        }
                        else if (srcElem.previousSibling)
                        {
                            position = "nextSibling";
                            tgtNode = srcElem.previousSibling.nodeObj;
                        }
                    }
                    if (position == "nextSibling")
                    {
                        while (! tgtNode.isRootNode() && tgtNode.isLastNode)
                        {
                            tgtNode = tgtNode.parentNode;
                        }
                    }
                }
                Tree.dropNode(nodeDragged, tgtNode, position, defaultDropEffect);
            }
        }
        Tree.dragging = false;
        Tree.nodeDragged = null;
    }
}

Tree.dropNode = function(srcNodeObj, tgtNodeObj, position, dropEffect)
{
    var tgtTreeObj = tgtNodeObj.treeObj, newNode;
    clearTimeout(tgtTreeObj.funcTimeout);
    if (position == "previousSibling" || position == "nextSibling" || tgtNodeObj.waitLoading(Tree.dropNode, window, srcNodeObj, tgtNodeObj, position, dropEffect))
    {
        dropEffect = tgtTreeObj.fireEvent("drop", dropEffect, [srcNodeObj, tgtTreeObj, tgtNodeObj, position]);
        if (dropEffect == "move")
        {
            newNode = srcNodeObj.moveTo(tgtNodeObj, position);
        }
        else if (dropEffect == "copy")
        {
            newNode = srcNodeObj.copyTo(tgtNodeObj, position);
        }
        if (newNode)
        {
            newNode.select();
        }
    }
}

Tree.defaultComparator = function(nodeObjA, nodeObjB)
{
    var nodeTextA = nodeObjA.text, nodeTextB = nodeObjB.text;
    return nodeTextA < nodeTextB ? -1 : nodeTextA > nodeTextB ? 1 : 0;
}

/******************************************************************************
 * TreeNode Definition
 *****************************************************************************/
function TreeNode(config)
{
//alert("new TreeNode(" + config + ")");
    this.name = Tree.sequence ++;
    var hasChildren;
    if (typeof config == "string")  // text
    {
        this.text = config;
    }
    else  // json object
    {
        config = config || {};
        leaflife.setConfig(this, config);
        hasChildren = config.childNodes ? true : false;
        if (hasChildren)
        {
            this.children = [];
        }
        if (config.checked)
        {
            this.checkState = 1;  // 0: unchecked, 1: checked, 2: gray checked
        }
    }
    this.readyState = hasChildren ^ 1;  // 0: uninitialize, 1: loaded, 2: loading
}

TreeNode.configurations = ["id", "text", "iconInactive", "iconActive", "prefix", "textStyle", "href", "target", "hint", "orderIndex", "level", "treeObj"];

TreeNode.prototype =
{
    "class": "TreeNode",
    dataProviderClass: "leaflife.widget.tree.data.TreeDataProvider",
    dataSourceClass: "leaflife.widget.tree.data.TreeDataSource",
/*
    children:
    isLastNode:
    code:
    parentNode:
    navObj:
    linkObj:
    prefixImg:
    hierarchyImg:
    iconImg:
    callbacks:  // [Function, Object, [arguments]] (perform only once)
*/
    nChildren: 0,
    level: 0,
    readyState: 1,  // 0: uninitialize, 1: loaded, 2: loading
    checkState: 0,  // 0: unchecked, 1: checked, 2: gray checked
    orderIndex: null,
    // public
    id: "",
    text: "",
    iconInactive: "",
    iconActive: "",
    prefix: null,  // none/checkbox/radio
    textStyle: "",
    href: "",
    target: null,  // frame/windowName/_blank/_parent/_search/_self/_top
    hint: "",
    expanded: false,
    data: null,

    setText: function(text)  // public
    {
        if (text)
        {
            this.text = text;
            var linkObj = this.linkObj;
            if (linkObj)
            {
                linkObj.firstChild.nodeValue = text;
            }
        }
    },

    setTextStyle: function(textStyle)  // public
    {
        textStyle = textStyle || "";
        var linkObj = this.linkObj;
        if (linkObj)
        {
            leaflife.resetStyle(linkObj, this.textStyle, textStyle);
        }
        this.textStyle = textStyle;
    },

    addTextStyle: function(textStyle)
    {
        var linkObj = this.linkObj;
        if (linkObj && textStyle)
        {
            leaflife.addStyle(linkObj, textStyle);
        }
    },

    removeTextStyle: function(textStyle)
    {
        var linkObj = this.linkObj;
        if (linkObj && textStyle)
        {
            leaflife.resetStyle(linkObj, textStyle);
        }
    },

    setHint: function(hint)  // public
    {
        this.hint = hint;
        if (this.linkObj)
        {
            this.linkObj.title = hint;
        }
    },

    isSelected: function()  // public
    {
        var treeObj = this.treeObj;
        return treeObj ? treeObj.nodeSelected.containsKey(this.name) : false;
    },

    getParentNode: function()  // public
    {
        return this.isRootNode() ? null : this.parentNode;
    },

    hasChildNodes: function()
    {
        return this.children ? true : false;
    },

    getChildNodes: function()
    {
        return this.children;
    },

    getPreviousSibling: function()  // public
    {
        return this.orderIndex ? this.parentNode.children[this.orderIndex - 1] : null;
    },

    getNextSibling: function()  // public
    {
        var nextIndex = this.orderIndex + 1;
        return nextIndex == this.parentNode.nChildren ? null : this.parentNode.children[nextIndex];
    },

    isAncestorOf: function(nodeObj)  // public
    {
        var parentNodeObj = nodeObj;
        while (parentNodeObj && this != parentNodeObj)
        {
            parentNodeObj = parentNodeObj.parentNode;
        }
        return this == nodeObj ? false : this == parentNodeObj;
    },

    isSiblingOf: function(nodeObj)  // public
    {
        return this.parentNode == nodeObj.parentNode;
    },

    isRootNode: function()  // public
    {
        return this.parentNode == this.treeObj.rootNode;
    },

    isLeafNode: function()  // public
    {
        return this.children ? false : true;
    },

    setHierarchyIcon: function(iconStyle)
    {
        if (this.hierarchyImg)
        {
            if (! iconStyle)
            {
                var isFirstRoot = this.level == 1 && this.orderIndex == 0;
                if (this.isLastNode)
                {
                    if (this.children)
                    {
                        if (this.expanded)
                        {
                            iconStyle = isFirstRoot ? "treeImgMinus1" : "treeImgMinus3";
                        }
                        else
                        {
                            iconStyle = isFirstRoot ? "treeImgPlus1" : "treeImgPlus3";
                        }
                    }
                    else
                    {
                        iconStyle = isFirstRoot ? "treeImgLine1" : "treeImgLine3";
                    }
                }
                else
                {
                    if (this.children)
                    {
                        if (this.expanded)
                        {
                            iconStyle = isFirstRoot ? "treeImgMinus2" : "treeImgMinus4";
                        }
                        else
                        {
                            iconStyle = isFirstRoot ? "treeImgPlus2" : "treeImgPlus4";
                        }
                    }
                    else
                    {
                        iconStyle = isFirstRoot ? "treeImgLine2" : "treeImgLine5";
                    }
                }
            }
            this.hierarchyImg.className = iconStyle;
        }
    },

    setIconStyleInactive: function(iconInactive)  // public
    {
        this.iconInactive = iconInactive;
        this.setIconStyle();
    },

    setIconStyleActive: function(iconActive)  // public
    {
        this.iconActive = iconActive;
        this.setIconStyle();
    },

    setIconStyle: function()
    {
        if (this.iconImg)
        {
            var iconStyle;
            if (this.children)
            {
                iconStyle = this.expanded ? (this.iconActive || "treeImgBranchActive") : (this.iconInactive || "treeImgBranchInactive");
            }
            else
            {
                iconStyle = this.isSelected() ? (this.iconActive || "treeImgLeafActive") : (this.iconInactive || "treeImgLeafInactive");
            }
            this.iconImg.className = iconStyle;
        }
    },

    setPrefixIcon: function()
    {
        if (this.prefixImg)
        {
            var treeObj = this.treeObj, iconStyle = this.prefix || treeObj.prefix;  // prefix
            switch (this.checkState)
            {
                case 0:
                {
                    iconStyle = iconStyle == "checkbox" ? "treeImgBoxUnchecked" : "treeImgRadioUnchecked";
                    break;
                }
                case 1:
                {
                    iconStyle = iconStyle == "checkbox" ? "treeImgBoxChecked" : "treeImgRadioChecked";
                    break;
                }
                case 2:
                {
                    iconStyle = treeObj.checkCascade == "three-state" ? "treeImgBoxCheckedPartial" : "treeImgBoxUnchecked";
                }
            }
            this.prefixImg.className = iconStyle;
        }
    },

    draw: function(insertAtObj)
    {
        var treeObj = this.treeObj, parentNode = this.parentNode;
        this.isLastNode = this.orderIndex == parentNode.nChildren - 1;
        var doc = treeObj.doc, divObj = doc.createElement("div"), code = this.code = this.level > 1 ? parentNode.code + (parentNode.isLastNode ? '0' : '1') : '', i = 0, tbObj, cellObj;
        tbObj = this.navObj = treeObj.container.insertBefore(doc.createElement("table"), insertAtObj);
        tbObj.cellPadding = tbObj.cellSpacing = 0;
        tbObj.nodeObj = this;
        tbObj = tbObj.insertRow(0);
        divObj.className = "treeIcon";
        for (; i < code.length; ++ i)  // draw hierarchy line
        {
            cellObj = doc.createElement("td");
            tbObj.appendChild(cellObj);
            cellObj.className = treeObj.hierarchyVisible && code.charAt(i) == '1' ? "treeImgLine4" : "";
            cellObj.appendChild(divObj.cloneNode(false));
        }
        if (treeObj.hierarchyVisible)  // draw hierarchy image
        {
            this.hierarchyImg = cellObj = doc.createElement("td");
            tbObj.appendChild(cellObj);
            cellObj.nodeObj = this;
            cellObj.onclick = Tree.clickOnHierarchy;
            cellObj.oncontextmenu = leaflife.cancelEvent;
            cellObj.appendChild(divObj.cloneNode(false));
            this.setHierarchyIcon();
        }
        if ((this.prefix || treeObj.prefix) != "none")  // draw prefixImg
        {
            this.prefixImg = cellObj = doc.createElement("td");
            tbObj.appendChild(cellObj);
            cellObj.nodeObj = this;
            cellObj.onclick = Tree.clickOnPrefix;
            cellObj.oncontextmenu = leaflife.cancelEvent;
            cellObj.appendChild(divObj.cloneNode(false));
            this.setPrefixIcon();
        }
        if (treeObj.nodeIconVisible)  // draw node image
        {
            this.iconImg = cellObj = doc.createElement("td");
            tbObj.appendChild(cellObj);
            cellObj.nodeObj = this;
            cellObj.onclick = Tree.clickOnIcon;
            cellObj.oncontextmenu = leaflife.cancelEvent;
            cellObj.appendChild(divObj.cloneNode(false));
            this.setIconStyle();
        }
        cellObj = doc.createElement("td");
        tbObj.appendChild(cellObj);
        var anchorObj = this.linkObj = doc.createElement("a");
        cellObj.appendChild(anchorObj);
        anchorObj.nodeObj = this;
        anchorObj.href = this.href || "#";
        anchorObj.target = this.target || treeObj.target;
        anchorObj.className = "treeNodeText " + this.textStyle + (treeObj.autoWrap ? " treeTextAutoWrap" : " treeTextNoWrap") + (treeObj.nodeSelected.containsKey(this.name) ? " treeHighlightedText" : "");
        anchorObj.title = this.hint || "";
        anchorObj.onclick = Tree.clickOnNode;
        anchorObj.ondblclick = Tree.dblClickOnNode;
        anchorObj.oncontextmenu = Tree.rightClickOnNode;
        anchorObj.onmousedown = Tree.mouseDownOnNode;
        anchorObj.dropEffect = cellObj.dropEffect = treeObj.dropEffect;
        anchorObj.appendChild(doc.createTextNode(this.text || ""));
    },

    drawIfRendered: function()  // draw if sibling node is rendered
    {
//alert(this.text + ".drawIfRendered()");
        var parentNodeObj = this.parentNode;
        if (parentNodeObj.nChildren > 1)
        {
            var siblingNodeObj = this.orderIndex == 0 ? parentNodeObj.children[1] : parentNodeObj.children[this.orderIndex - 1];
            if (siblingNodeObj.navObj)
            {
                this.redraw(true);
                if (this.isLastNode && siblingNodeObj.isLastNode)
                {
                    siblingNodeObj.isLastNode = false;
                    siblingNodeObj.resetCode(parentNodeObj.level, 1);
                }
                siblingNodeObj.setHierarchyIcon();
            }
        }
        else if (! parentNodeObj.parentNode && parentNodeObj.expanded)  // the first root node
        {
            this.draw(null);
        }
    },

    redraw: function(render)
    {
//        alert(this.text + ".redraw(" + render + ")");
        var parentNodeObj = this.parentNode, pNode, ppNode, insertAtObj;
        if (parentNodeObj)
        {
            this.isLastNode = this.orderIndex == parentNodeObj.nChildren - 1;
            if (this.navObj)
            {
                this.resetCode(parentNodeObj.level, this.isLastNode ? 0 : 1);
                this.setHierarchyIcon();
                this.setPrefixIcon();
                this.setIconStyle();
            }
            else if (render && parentNodeObj.nChildren > 1)
            {
                if (this.isLastNode)
                {
                    pNode = parentNodeObj.children[this.orderIndex - 1];
                    while (pNode.nChildren)
                    {
                        ppNode = pNode.children[pNode.nChildren - 1];
                        if (ppNode.navObj)
                        {
                            pNode = ppNode;
                        }
                        else
                        {
                            break;
                        }
                    }
                    insertAtObj = pNode.navObj.nextSibling;
                }
                else
                {
                    insertAtObj = parentNodeObj.children[this.orderIndex + 1].navObj;
                }
                this.draw(insertAtObj || null);
                if (! parentNodeObj.expanded)
                {
                    this.navObj.style.display = "none";
                }
            }
        }
    },

    resetCode: function(pos, code)
    {
        var nodeObj = this;
        if (nodeObj.treeObj.hierarchyVisible)
        {
            var nodes = [], len = 0, childNode, nodeCode, i;
            while (nodeObj)
            {
                for (i = nodeObj.nChildren - 1; i > -1; -- i)
                {
                    childNode = nodeObj.children[i];
                    nodeCode = childNode.code;
                    if (! childNode.navObj || nodeCode.charAt(pos) == code)
                    {
                        break;
                    }
                    childNode.code = nodeCode.substring(0, pos) + code + nodeCode.substring(pos + 1);
                    childNode.navObj.rows[0].cells[pos].className = code ? "treeImgLine4" : "";
                    nodes[len ++] = childNode;
                }
                nodeObj = nodes[-- len];
            }
        }
    },

    erase: function()
    {
        var navObj = this.navObj;
        if (navObj)
        {
            this.navObj = navObj.nodeObj = null;
            if (this.prefixImg)
            {
                this.prefixImg = this.prefixImg.nodeObj = null;
            }
            if (this.linkObj)
            {
                this.linkObj = this.linkObj.nodeObj = null;
            }
            if (this.hierarchyImg)
            {
                this.hierarchyImg = this.hierarchyImg.nodeObj = null;
            }
            if (this.iconImg)
            {
                this.iconImg = this.iconImg.nodeObj = null;
            }
            navObj.parentNode.removeChild(navObj);
        }
    },

    eraseChildren: function()
    {
        var nodeObj = this, len = 0, nodes = [], childNode, i;
        while (nodeObj)
        {
            for (i = nodeObj.nChildren - 1; i > -1; -- i)
            {
                childNode = nodeObj.children[i];
                if (childNode.navObj)
                {
                    childNode.erase();
                    if (childNode.nChildren)
                    {
                        nodes[len ++] = childNode;
                    }
                }
                else
                {
                    break;
                }
            }
            nodeObj = nodes[-- len];
        }
    },

    isChecked: function()  // public
    {
        return this.checkState == 1;
    },

    check: function(cascade)  // public
    {
//alert(this + ".check()");
        if (this.checkState != undefined)
        {
            this.setCheckState(1, this);
            this.checkCascade(this, cascade);
        }
    },

    uncheck: function(cascade)
    {
        if (this.checkState)
        {
            this.setCheckState(0, this);
            this.checkCascade(this, cascade);
        }
    },

    checkCascade: function(srcNode, cascade)
    {
        var treeObj = this.treeObj;
        if (cascade == undefined)  // using default cascade configuration
        {
            cascade = treeObj.checkCascade != "none";
        }
        if (cascade && (this.prefix || treeObj.prefix) == "checkbox")
        {
            this.checkDescendants(srcNode);
            this.parentNode.checkAncestors(srcNode);
            treeObj.fireEvent("cascadecheckchange", null, [this]);
        }
    },

    /**
     * Check or uncheck checkbox/radio
     * @param checkState: 0: uncheck, 1: check, 2: grayed check
     * @param srcNode: source node trigger this action
     */
    setCheckState: function(checkState, srcNode)
    {
//        alert(this + ".setCheckState(" + checkState + "," + srcNode + ")");
        var treeObj = this.treeObj, stateChange = checkState % 2 != this.checkState % 2;
        if ((! stateChange || treeObj.fireEvent("beforecheckchange", true, [this, checkState == 1, srcNode])) && checkState != this.checkState)
        {
            this.checkState = checkState;
            this.setPrefixIcon();
            this.setNodeChecked(checkState);
            if (stateChange)
            {
                treeObj.fireEvent("aftercheckchange", true, [this, srcNode]);
            }
        }
    },

    setNodeChecked: function(checkState)
    {
        var treeObj = this.treeObj, radiobox = (this.prefix || treeObj.prefix) == "radio", nodeChecked = radiobox ? treeObj.nodeRadioed : treeObj.nodeChecked;
        if (checkState == 2)  // checked gray
        {
            nodeChecked.remove(this.name);
            treeObj.nodeCheckedPartial.put(this.name, this);
        }
        else
        {
            var checkIdObj = radiobox ? this.parentNode : this, oldNodeObj;
            if (checkState)  // checked
            {
                if (radiobox)
                {
                    if (treeObj.radioGroup == "all")
                    {
                        checkIdObj = treeObj.rootNode;
                    }
                    oldNodeObj = nodeChecked.get(checkIdObj.name);
                    if (oldNodeObj && oldNodeObj != this)
                    {
                        oldNodeObj.setCheckState(0, this);
                    }
                }
                nodeChecked.put(checkIdObj.name, this);
            }
            else  // unchecked
            {
                nodeChecked.remove(checkIdObj.name);
            }
            if (! radiobox)
            {
                treeObj.nodeCheckedPartial.remove(this.name);
            }
        }
    },

    checkDescendants: function(srcNode)
    {
//        alert(this + ".checkDescendants(" + srcNode + ")");
        var nodeObj = this, nodes = [], len = 0, treePrefix = nodeObj.treeObj.prefix, childNode, i;
        if (! srcNode)
        {
            srcNode = nodeObj;
        }
        while (nodeObj)
        {
            for (i = nodeObj.nChildren - 1; i > -1; -- i)
            {
                childNode = nodeObj.children[i];
                if ((childNode.prefix || treePrefix) == "checkbox")
                {
                    childNode.setCheckState(nodeObj.checkState, srcNode);
                    if (childNode.nChildren)
                    {
                        nodes[len ++] = childNode;
                    }
                }
            }
            nodeObj = nodes[-- len];
        }
    },

    checkAncestors: function(srcNode)
    {
//        alert(this.text + ".checkAncestors(" + srcNode + ")");
        var nodeObj = this, treeObj = nodeObj.treeObj, treePrefix = treeObj.prefix;
        if (! srcNode)
        {
            srcNode = nodeObj;
        }
        if (treeObj.checkCascade != "none")  // cascade check/uncheck
        {
            while ((nodeObj.prefix || treePrefix) == "checkbox" && nodeObj.level)
            {
                var isAllChecked = true, isPatialchecked = false, isAllRadio = true, i = nodeObj.nChildren - 1;
                for (; i > -1; -- i)
                {
                    var childNode = nodeObj.children[i], checkState = childNode.checkState;
                    if ((childNode.prefix || treePrefix) == "checkbox")
                    {
                        isAllRadio = false;
                        if (checkState != 1)
                        {
                            isAllChecked = false;
                        }
                        if (checkState != 0)
                        {
                            isPatialchecked = true;
                        }
                    }
                }
                if (! isAllRadio)
                {
                    nodeObj.setCheckState(isAllChecked ? 1 : isPatialchecked ? 2 : 0, srcNode);
                }
                nodeObj = nodeObj.parentNode;
            }
        }
    },

    getOrderIndexByMode: function(mode, moveSibling)
    {
        if (this.treeObj.autoSort)
        {
            return null;
        }
        switch (mode)
        {
            case "previousSibling":
            {
                return moveSibling ? this.orderIndex - 1 : this.orderIndex;
            }
            case "nextSibling":
            {
                return moveSibling ? this.orderIndex : this.orderIndex + 1;
            }
            case "firstChild":
            {
                return 0;
            }
            default:  // lastChild
            {
                return this.nChildren;
            }
        }
    },

    refreshDataSource: function(parameters)
    {
        var dataSource = this.treeObj.dataSource;
        if (dataSource)
        {
            if (this.nChildren)
            {
                this.clear();
            }
            dataSource.loadData(this, {nodeId: this.id}, parameters);
        }
        else
        {
            throw new Error("No tree data source binded.");
        }
    },

    loadJSON: function(json)  // public
    {
        var nodeObj = this, jsonObj;
        if (! nodeObj.nChildren)
        {
            try
            {
                if (jsonObj = leaflife.parseJSON(json))
                {
                    var treeObj = nodeObj.treeObj, objs = [], nodes = [], objLen = 0, jsonLen, childNodes, newNodeObj, i;
                    if (! (jsonObj instanceof Array))
                    {
                        treeObj.attachNode(newNodeObj = new TreeNode(jsonObj));
                        nodeObj.insertChild(newNodeObj);
                        jsonObj = jsonObj.childNodes;
                        nodeObj = newNodeObj;
                    }
                    while (jsonObj)  // array
                    {
                        jsonLen = jsonObj.length;
                        for (i = 0; i < jsonLen; ++ i)
                        {
                            treeObj.attachNode(newNodeObj = new TreeNode(jsonObj[i]));
                            nodeObj.insertChild(newNodeObj);
                            childNodes = jsonObj[i].childNodes;
                            if (childNodes instanceof Array)
                            {
                                nodes[objLen] = newNodeObj;
                                objs[objLen ++] = childNodes;
                            }
                        }
                        nodeObj = nodes[-- objLen];
                        jsonObj = objs[objLen];
                    }
                }
            }
            catch (e)
            {
                throw new Error("Invalid tree data: " + e.message);
            }
            finally
            {
                this.completeLoading();
                if (! jsonObj)  // refresh the node icon
                {
                    this.setHierarchyIcon();
                    this.setIconStyle();
                }
            }
        }
    },

    toJSONString: function(withChildren)
    {
        if (this != this.treeObj.rootNode)
        {
            var result = [], configurations = TreeNode.configurations, jsonName = ["id", "text", "iconInactive", "iconActive", "prefix", "textStyle", "href", "target", "hint"], children = this.children, expanded = this.expanded, checkState = this.checkState, data = this.data, i = 8, j = 0, propVal;
            for (; i > -1; -- i)
            {
//                propVal = this["_" + i];
                propVal = this[configurations[i]];
                if (propVal != undefined && propVal !== "")
                {
                    result[j ++] = '"' + jsonName[i] + '":' + leaflife.toJSONString(propVal);
                }
            }
            if (checkState == 1)
            {
                result[j ++] = '"checked":true';
            }
            if (data)
            {
                propVal = leaflife.toJSONString(data);
                if (propVal)
                {
                    result[j ++] = '"data":' + propVal;
                }
            }
            if (children)
            {
                if (expanded)
                {
                    result[j ++] = '"expanded":true';
                }
                result[j ++] = '"childNodes":' + (withChildren && this.nChildren ? leaflife.toJSONString(children, withChildren) : "[]");
            }
            return '{' + result.join(',') + '}';
        }
    },

/*    loadXML: function(xml)
    {
        var nodeObj = this, xmlElem = xml, xmlParser;
        if (! nodeObj.nChildren)
        {
            try
            {
                if (typeof xml == "string")
                {
                    xmlParser = Tree.xmlParser;
                    if (! xmlParser)
                    {
                        xmlParser = Tree.xmlParser = new DOMParser();
                    }
                    xmlElem = xmlParser.parseFromString(xml, "text/xml");
                    xmlElem = xmlElem.firstChild;
                }
                if (xmlElem)
                {
                    if (xmlElem.tagName == "parsererror")
                    {
                        throw new Error(xmlElem.firstChild.nodeValue);
                    }
                    var xmlList = xmlElem.childNodes, treeObj = nodeObj.treeObj, objs = [], nodes = [], objLen = 0, newNodeObj;
                    Tree.nodesLazyCheck.clear();
                    while (xmlList)
                    {
                        xmlElem = xmlList[0];
                        while (xmlElem)
                        {
                            if (xmlElem.nodeType == 1)  // ELEMENT_NODE
                            {
                                treeObj.attachNode(newNodeObj = new TreeNode(xmlElem));
                                nodeObj.insertChild(newNodeObj);
                                if (xmlElem.hasChildNodes())
                                {
                                    nodes[objLen] = newNodeObj;
                                    objs[objLen ++] = xmlElem.childNodes;
                                }
                            }
                            xmlElem = xmlElem.nextSibling;
                        }
                        nodeObj = nodes[-- objLen];
                        xmlList = objs[objLen];
                    }
                }
            }
            finally
            {
                this.completeLoading();
            }
        }
    },
*/
    waitLoading: function(funcCallback, thisObj, arg1, arg2, arg3, arg4)
    {
//        alert(this + ".waitLoading(" + funcCallback + "," + thisObj + "," + arg1 + "," + arg2 + "," + arg3 + ")");
        var node = this, ready;
        switch (node.readyState)
        {
            case 0:  // uninitialized
            {
                node.setHierarchyIcon("treeImgLoading");
                node.readyState = 2;
                node.treeObj.fireEvent("beforeload", true, [node]);  // Event: loading children nodes
            }
            case 2:  // loading
            {
                ready = node.readyState == 1;
                if (ready)
                {
                    node.setHierarchyIcon();
                }
                else
                {
                    this.addEventHook(funcCallback, thisObj, arg1, arg2, arg3, arg4);
                }
                return ready;
            }
            case 1:  // loaded
            {
                return true;
            }
        }
    },

    addEventHook: function(funcCallback, thisObj, arg1, arg2, arg3, arg4)
    {
        var callbacks = this.callbacks, args = arg1 == undefined ? [] : arg2 == undefined ? [arg1] : arg3 == undefined ? [arg1, arg2] : arg4 == undefined ? [arg1, arg2, arg3] : [arg1, arg2, arg3, arg4];
        if (callbacks)  // [Function, Object, [arguments]]
        {
            if (callbacks[0] != funcCallback)
            {
                callbacks.splice(0, 0, args);
                callbacks.splice(0, 0, thisObj);
                callbacks.splice(0, 0, funcCallback);
            }
        }
        else
        {
            this.callbacks = [funcCallback, thisObj, args];
        }
    },

    completeLoading: function()
    {
        var treeObj = this.treeObj, callbacks = this.callbacks, ownerWidget = this.ownerWidget, i;
        this.readyState = 1;  // load complete
        if (! this.nChildren)
        {
            this.children = null;
        }
        Tree.nodesLazyCheck.invoke(TreeNode.prototype.checkAncestors);
        if (this == treeObj.rootNode && treeObj.container)  // the root
        {
            treeObj.render();
        }
        if (callbacks)  // execute hook function (first the last hook)
        {
            i = callbacks.length - 1;
            while (i > -1)
            {
                var args = callbacks[i --], thisObj = callbacks[i --], funcCallback = callbacks[i];
                if (funcCallback)
                {
                    callbacks.length = i --;
                    funcCallback.apply(thisObj, args);
                }
            }
        }
        Tree.nodesLazyCheck.clear();
        treeObj.fireEvent("afterload", true, [this]);
        if (ownerWidget && ownerWidget.completeLoading)
        {
            ownerWidget.completeLoading();
        }
    },

    /*
     * nodeObj: source node (object/TreeNode)
     * position: insert position (firstChild/lastChild/previousSibling/nextSibling), default: sorted position/last child
     */
    insert: function(nodeObj, position)  // public
    {
//alert(this + ".insert(" + nodeObj + "," + position + ")");
        var treeObj = this.treeObj, parentNodeObj = (position == "previousSibling" || position == "nextSibling") ? this.parentNode : this;
        if (nodeObj && this.waitLoading(this.insert, this, nodeObj, position) && treeObj.fireEvent("beforeinsert", true, [this, position, nodeObj]))
        {
            treeObj.attachNode(nodeObj);
            parentNodeObj.insertChild(nodeObj);
            this.checkAncestors();
            this.setHierarchyIcon();
            this.setIconStyle();
            nodeObj.drawIfRendered();
            treeObj.fireEvent("afterinsert", true, [this, position, nodeObj]);
        }
    },

    getOrderIndexSorted: function(nodeObj)
    {
        var orderIndex = this.nChildren;
        if (orderIndex)
        {
            var treeObj = this.treeObj;
            if (treeObj.oncompare(this.children[0], nodeObj) == 1)
            {
                orderIndex = 0;
            }
            else if (orderIndex > 1 && treeObj.oncompare(this.children[orderIndex - 1], nodeObj) == 1)
            {
                var indexStart = 1, indexEnd = orderIndex - 1, indexSearch;
                while (indexStart <= indexEnd)
                {
                    indexSearch = parseInt((indexStart + indexEnd) / 2);
                    if (treeObj.oncompare(this.children[indexSearch], nodeObj) == 1)
                    {
                        indexEnd = indexSearch - 1;
                    }
                    else
                    {
                        indexStart = indexSearch + 1;
                    }
                }
                orderIndex = indexStart;
            }
        }
        return orderIndex;
    },

    insertChild: function(nodeObj)
    {
//        alert(this.text + ".insertChild(" + nodeObj.text + ")");
        var parentNode = this, childNodes = parentNode.children, orderIndex = nodeObj.orderIndex, treeObj = nodeObj.treeObj = parentNode.treeObj, i = parentNode.nChildren ++, checkState = nodeObj.checkState, treePrefix = treeObj.prefix, recheckOnload = treeObj.recheckOnload;
        orderIndex = treeObj.autoSort ? parentNode.getOrderIndexSorted(nodeObj) : orderIndex == undefined || orderIndex > i ? i : orderIndex;
        if (! childNodes)
        {
            childNodes = parentNode.children = [];
        }
        childNodes.splice(orderIndex, 0, nodeObj);
        for (; i >= orderIndex; -- i)
        {
            childNodes[i].orderIndex = i;  // orderIndex
        }
        parentNode.readyState = 1;
        nodeObj.parentNode = parentNode;
        nodeObj.level = parentNode.level + 1;  // root node level start from 1
        // validate check state
        switch (nodeObj.prefix || treePrefix)
        {
            case "checkbox":
            {
                if (checkState == undefined)
                {
                    checkState = 0;
                }
                if (treeObj.checkCascade != "none" && parentNode.level && (parentNode.prefix || treePrefix) == "checkbox" && recheckOnload != "none")  // non-root
                {
                    var parentCheckState = parentNode.checkState;
                    if (checkState != parentCheckState)
                    {
                        if (recheckOnload == "new")
                        {
                            Tree.nodesLazyCheck.put(parentNode.name, parentNode);  // lazy check ancestors
                        }
                        else if (parentCheckState < 2)  // recheck children
                        {
                            checkState = parentCheckState;
                        }
                    }
                }
                break;
            }
            case "radio":
            {
                if (checkState == undefined || checkState == 2)
                {
                    checkState = 0;
                }
                else if (checkState == 1 && recheckOnload != "none")
                {
                    var nodeRechecked = treeObj.nodeRadioed.get(treeObj.radioGroup == "all" ? treeObj.rootNode.name : parentNode.name);
                    if (nodeRechecked && nodeRechecked != nodeObj)
                    {
                        if (recheckOnload == "new")
                        {
                            nodeRechecked.setNodeChecked(0);
                        }
                        else
                        {
                            checkState = 0;
                        }
                    }
                }
                break;
            }
            default:
            {
                checkState = undefined;
            }
        }
        nodeObj.checkState = checkState;
        if (checkState == 1)
        {
            nodeObj.setNodeChecked(checkState);
        }
    },

    detachFromTree: function(newTreeObj)
    {
        var nodeObj = this, treeObj = nodeObj.treeObj, treePrefix = treeObj.prefix, nodes = [], len = 0, i;
        while (nodeObj)
        {
            var namedNodes = treeObj.nodeMap[nodeObj.id], radiobox, nodeChecked, checkIdObj;
            if (namedNodes)
            {
                for (i = namedNodes.length - 1; i > -1; -- i)
                {
                    if (namedNodes[i] == nodeObj)
                    {
                        namedNodes.splice(i, 1);
                        break;
                    }
                }
            }
            treeObj.nodeSelected.remove(nodeObj.name);
            switch (nodeObj.checkState)
            {
                case 1:
                {
                    radiobox = (nodeObj.prefix || treePrefix) == "radio", nodeChecked = radiobox ? treeObj.nodeRadioed : treeObj.nodeChecked, checkIdObj = radiobox ? treeObj.radioGroup == "all" ? treeObj.rootNode : nodeObj.parentNode : nodeObj;
                    nodeChecked.remove(checkIdObj.name);
                    break;
                }
                case 2:
                {
                    treeObj.nodeCheckedPartial.remove(nodeObj.name);
                }
            }
            nodeObj.checkState = 0;
            nodeObj.erase();
            delete nodeObj.callbacks;  // clear the callback functions
            nodeObj.treeObj = newTreeObj;
            nodeObj.expanded = false;
            if (nodeObj.nChildren)
            {
                nodes = nodes.concat(nodeObj.children);
            }
            nodeObj = nodes[len ++];
        }
    },

    remove: function()  // public
    {
//        alert(this.text + ".remove()");
        var treeObj = this.treeObj, parentNode;
        if (treeObj.fireEvent("beforeremove", true, [this]))
        {
            parentNode = this.parentNode;
            this.detachFromTree();
            this.detachFromParent();
            parentNode.checkAncestors();
            treeObj.fireEvent("afterremove", true, [this]);
        }
    },

    detachFromParent: function()
    {
//        alert(this + ".detachFromParent()");
        var nodeObj = this, orderIndex = nodeObj.orderIndex, i = orderIndex, parentNode = nodeObj.parentNode, childNodes = parentNode.children;
        childNodes.splice(orderIndex, 1);
        -- parentNode.nChildren;
        for (; i < parentNode.nChildren; ++ i)
        {
            childNodes[i].orderIndex = i;  // orderIndex
        }
        if (parentNode.nChildren)
        {
            if (nodeObj.level == 1 && ! orderIndex)  // redraw sibling of root node
            {
                childNodes[0].redraw(false);
            }
            if (nodeObj.isLastNode)  // redraw previous sibling node
            {
                childNodes[nodeObj.orderIndex - 1].redraw(false);
            }
        }
        else
        {
            parentNode.children = null;
            parentNode.expanded = false;
            parentNode.setHierarchyIcon();
            parentNode.setIconStyle();
        }
        nodeObj.parentNode = null;
    },

    removeChildren: function()
    {
        this.clear();
        this.setHierarchyIcon();
        this.setIconStyle();
        if (this.checkState == 2)  // partial checked
        {
            this.checkState = 0;
            this.setPrefixIcon();
            this.checkAncestors();
        }
    },

    reload: function()  // public
    {
        if (this.readyState == 1)
        {
            this.clear();
            this.readyState = 2;
            this.checkAncestors();
            this.treeObj.fireEvent("beforeload", true, [this == treeObj.rootNode ? null : this]);  // Event: loading children nodes
        }
    },

    clear: function()
    {
        var childNodes = this.children, i = this.nChildren - 1;
        for (; i > -1; -- i)
        {
            childNodes[i].detachFromTree();
        }
        this.children = null;
        this.nChildren = 0;
        this.expanded = false;
    },

    edit: function()  // public
    {
        var txtbox = Tree.txtbox, treeObj = this.treeObj, linkObj = this.linkObj, text;
        if (linkObj && linkObj.contentEditable != "true" && treeObj.fireEvent("beforeedit", true, [this]))
        {
            if (! txtbox)
            {
                Tree.txtbox = txtbox = treeObj.doc.createElement("input");
                txtbox.type = "text";
                txtbox.className = "treeNodeText treeEditbox treeTextAutoWrap";
                txtbox.onblur = Tree.blurOnEditbox;
                txtbox.onkeypress = Tree.keyPressOnEditbox;
                txtbox.style.display = "none";
            }
            linkObj.parentNode.appendChild(txtbox);
            txtbox.style.width = linkObj.offsetWidth;
            txtbox.style.height = linkObj.offsetHeight;
            linkObj.style.display = "none";
            text = txtbox.value = this.text;
            txtbox.style.display = "";
            txtbox.setSelectionRange(0, text.length);
            txtbox.focus();
        }
    },

    isExpanded: function()  // public
    {
        return this.children ? this.expanded : false;
    },

    expand: function(expandChildren)  // public
    {
//alert(this.text + ".expand()");
        var nodeObj = this, treeObj = nodeObj.treeObj;
        if (nodeObj.children && treeObj)
        {
            var trigger = true, nodes = [], len = 0, expanding = true, i, childNode;
            while (nodeObj)
            {
                if ((expandChildren || expanding) && nodeObj.waitLoading(nodeObj.expand, nodeObj, expandChildren))
                {
                    for (i = nodeObj.nChildren - 1; i > -1; -- i)
                    {
                        childNode = nodeObj.children[i];
                        if (childNode.navObj)
                        {
                            childNode.navObj.style.display = "";
                        }
                        else if (nodeObj.navObj)
                        {
                            childNode.draw(nodeObj.navObj.nextSibling);
                        }
                        else if (nodeObj == treeObj.rootNode)
                        {
                            childNode.draw(treeObj.container.firstChild);
                        }
                        if (childNode.children)
                        {
                            nodes[len ++] = childNode;
                        }
                    }
                    if (trigger && nodeObj.nChildren)
                    {
                        nodeObj.expanded = true;
                        nodeObj.setHierarchyIcon();
                        nodeObj.setIconStyle();
                        treeObj.fireEvent("expand", true, [nodeObj]);
                    }
                    if (! expandChildren)
                    {
                        trigger = false;
                    }
                }
                if (nodeObj = nodes[-- len])
                {
                    expanding = nodeObj.expanded;
                }
            }
        }
    },

    expandAncestors: function()  // public
    {
        var nodeObj = this, treeObj = nodeObj.treeObj;
        if (treeObj)
        {
            var rootNode = treeObj.rootNode;
            while (nodeObj.parentNode != rootNode)
            {
                nodeObj = nodeObj.parentNode;
                nodeObj.expand();
            }
        }
    },

    collapse: function(collapseChildren)  // public
    {
        var nodeObj = this;
        if (nodeObj.nChildren)
        {
            var treeObj = nodeObj.treeObj, trigger = true, nodes = [], len = 0, expanded, i, childNode;
            while (nodeObj)
            {
                expanded = nodeObj.expanded;
                if (collapseChildren || expanded)
                {
                    for (i = nodeObj.nChildren - 1; i > -1; -- i)
                    {
                        childNode = nodeObj.children[i];
                        if (expanded && childNode.navObj)
                        {
                            childNode.navObj.style.display = "none";
                        }
                        if (childNode.nChildren)
                        {
                            nodes[len ++] = childNode;
                        }
                    }
                    if (trigger && expanded)
                    {
                        nodeObj.expanded = false;
                        nodeObj.setHierarchyIcon();
                        nodeObj.setIconStyle();
                        treeObj.fireEvent("collapse", true, [nodeObj]);
                    }
                    if (! collapseChildren)
                    {
                        trigger = false;
                    }
                }
                nodeObj = nodes[-- len];
            }
        }
    },

    collapseSiblings: function()  // public
    {
        var parentNode = this.parentNode, i = parentNode.nChildren - 1, childNode;
        for (; i > -1; -- i)
        {
            childNode = parentNode.children[i];
            if (childNode != this)
            {
                childNode.collapse();
            }
        }
    },

    select: function(preserveSelected)
    {
        var treeObj = this.treeObj;
        if (treeObj)
        {
            this.expandAncestors();
            var nodeId = this.name, nodeSelected = treeObj.nodeSelected;
            if (! preserveSelected)
            {
                treeObj.unselectAll();
            }
            if (! nodeSelected.containsKey(nodeId) && treeObj.fireEvent("beforeselectchange", true, [this, true]) && ! nodeSelected.containsKey(nodeId))
            {
                nodeSelected.put(nodeId, this);
                this.addTextStyle("treeHighlightedText");
                this.setIconStyle();
                var treeNavObj = treeObj.container, navObj = this.navObj, linkObj = this.linkObj, scrollTop = treeNavObj.scrollTop, scrollHeight = scrollTop + treeNavObj.clientHeight;
                if (navObj.offsetTop < scrollTop || navObj.offsetTop + navObj.offsetHeight > scrollHeight)  // scroll to middle area
                {
                    treeNavObj.scrollTop = navObj.offsetTop - parseInt(treeNavObj.clientHeight / 2);
                }
                treeObj.fireEvent("afterselectchange", true, [this]);
            }
        }
    },

    unselect: function()
    {
        var treeObj = this.treeObj, nodeId = this.name, nodeSelected = treeObj.nodeSelected;
        if (nodeSelected.containsKey(nodeId) && treeObj.fireEvent("beforeselectchange", true, [this, false]) && nodeSelected.containsKey(nodeId))
        {
            nodeSelected.remove(nodeId);
            this.removeTextStyle("treeHighlightedText");
            this.setIconStyle();
            treeObj.fireEvent("afterselectchange", true, [this]);
        }
    },

    /*
     * mode (null: child node auto determined (sorted position / last child), firstChild, lastChild, previousSibling, nextSibling)
     */
    moveTo: function(tgtNodeObj, mode)
    {
//        alert(this.text + ".moveTo(" + tgtNodeObj.text + "," + mode + ")");
        var node = this, toSibling = mode == "previousSibling" || mode == "nextSibling";
        if (tgtNodeObj && node != tgtNodeObj && (toSibling || tgtNodeObj.waitLoading(node.moveTo, node, tgtNodeObj, mode)))
        {
            var srcTreeObj = node.treeObj, srcParentNodeObj = node.parentNode, srcOrderIndex = node.orderIndex, tgtTreeObj = tgtNodeObj.treeObj, tgtParentNode = toSibling ? tgtNodeObj.parentNode : tgtNodeObj, tgtOrderIndex;
            if (srcTreeObj != tgtTreeObj)  // move between trees
            {
                node.detachFromTree(tgtTreeObj);
                node.detachFromParent();
                node.orderIndex = tgtNodeObj.getOrderIndexByMode(mode);  // orderIndex
                tgtParentNode.insertChild(node);
            }
            else if (toSibling || ! node.isAncestorOf(tgtNodeObj))  // move inside a tree
            {
                tgtOrderIndex = tgtNodeObj.getOrderIndexByMode(mode, srcParentNodeObj == tgtNodeObj.parentNode && srcOrderIndex < tgtNodeObj.orderIndex);
                node.collapse();
                node.setNodeChecked(0);
                node.detachFromParent();  // remove this node from it's parent
                node.eraseChildren();
                node.erase();
                node.orderIndex = tgtOrderIndex;
                tgtParentNode.insertChild(node);
                tgtParentNode.setHierarchyIcon();
            }
            else
            {
                return;
            }
            node.drawIfRendered();
            srcParentNodeObj.checkAncestors();  // check source node's ancestors
            tgtNodeObj.checkAncestors();
            tgtTreeObj.fireEvent("move", true, [srcParentNodeObj, srcOrderIndex, tgtTreeObj, node]);
            return node.treeObj ? node : null;  // check whether the node has been detached from tree
        }
        return null;
    },

    /*
     * mode (null: child node auto determined (sorted position / last child), firstChild, lastChild, previousSibling, nextSibling)
    */
    copyTo: function(tgtNodeObj, mode)
    {
//        alert(this.text + ".copyTo(" + tgtNodeObj + "," + mode + ")");
        var srcNode = this, toSibling = mode == "previousSibling" || mode == "nextSibling";
        if (tgtNodeObj && srcNode != tgtNodeObj && (toSibling || tgtNodeObj.waitLoading(srcNode.copyTo, srcNode, tgtNodeObj, mode) || ! srcNode.isAncestorOf(tgtNodeObj)))
        {
            var tgtTreeObj = tgtNodeObj.treeObj, tgtParentNode = toSibling ? tgtNodeObj.parentNode : tgtNodeObj, nodeCloned = leaflife.clone(srcNode), nodes = [], nodesCloned = [], len = 0, childNode, newNode, i;
            nodeCloned.orderIndex = tgtNodeObj.getOrderIndexByMode(mode);
            tgtParentNode.insertChild(nodeCloned);
            tgtTreeObj.attachNode(nodeCloned);
            tgtParentNode = nodeCloned;
            while (srcNode)
            {
                for (i = 0; i < srcNode.nChildren; ++ i)
                {
                    childNode = srcNode.children[i];
                    newNode = leaflife.clone(childNode);
                    tgtParentNode.insertChild(newNode);
                    tgtTreeObj.attachNode(newNode);
                    if (childNode.nChildren)
                    {
                        nodesCloned[len] = newNode;
                        nodes[len ++] = childNode;
                    }
                }
                tgtParentNode = nodesCloned[-- len];
                srcNode = nodes[len];
            }
            tgtNodeObj.checkAncestors();
            nodeCloned.drawIfRendered();
            tgtTreeObj.fireEvent("copy", true, [this.parentNode, this.orderIndex, tgtTreeObj, nodeCloned]);
            return nodeCloned.treeObj ? nodeCloned : null;  // check whether the node has been detached from tree
        }
        return null;
    },

    /**
     * exclude child nodes
     */
    clone: function()
    {
        var newNode = new TreeNode(), nodeObj = this, hasChildren = nodeObj.children ? true : false, data = nodeObj.data;
        newNode.id = nodeObj.id;
        newNode.text = nodeObj.text;
        newNode.iconInactive = nodeObj.iconInactive;
        newNode.iconActive = nodeObj.iconActive;
        newNode.prefix = nodeObj.prefix;
        newNode.textStyle = nodeObj.textStyle;
        newNode.href = nodeObj.href;
        newNode.target = nodeObj.target;
        newNode.hint = nodeObj.hint;
        newNode.checkState = nodeObj.checkState;  // 0: unchecked, 1: checked, 2: gray checked
        newNode.readyState = hasChildren ^ 1;  // 0: uninitialize, 1: loaded, 2: loading
        if (hasChildren)
        {
            newNode.children = [];
            newNode.expanded = false;
        }
        if (data != undefined)
        {
            newNode.data = leaflife.clone(data);
        }
        return newNode;
    },

    sort: function()  // public
    {
        if (this.nChildren)
        {
            var childNodes = this.children, expanded = this.expanded, i = this.nChildren - 1;
            if (expanded)
            {
                this.eraseChildren();
            }
            childNodes.sort(this.treeObj.oncompare);
            for (; i > -1; -- i)
            {
                childNodes[i].orderIndex = i;  // orderIndex
            }
            if (expanded)
            {
                this.expand();
            }
        }
    },

    setDropEffect: function(event, posPreviousSibling)
    {
        var srcNodeObj = Tree.nodeDragged, tgtTreeObj = this.treeObj, dropEffect = tgtTreeObj.dropEffect, srcElem = event.target, droppableSibling = Tree.droppableSibling, cursor = "default", srcTreeObj;
        if (srcNodeObj)
        {
            srcTreeObj = srcNodeObj.treeObj;
            if (tgtTreeObj == srcTreeObj && dropEffect != "none" && (srcNodeObj == this || srcNodeObj.isAncestorOf(this)))  // drag inside tree
            {
                dropEffect = "none";
            }
            if (dropEffect != "none")
            {
                dropEffect = srcTreeObj.fireEvent("dragging", dropEffect, [srcNodeObj, tgtTreeObj, this, posPreviousSibling == undefined ? "lastChild" : posPreviousSibling ? "previousSibling" : "nextSibling"]);
            }
        }
        switch (dropEffect)
        {
            case "none":
            {
                cursor = "no-drop";
                break;
            }
            case "move":
            {
                cursor = "-moz-alias";
                break;
            }
            case "copy":
            {
                cursor = "copy";
            }
        }
        srcElem.style.cursor = droppableSibling.style.cursor = cursor;
        return droppableSibling.dropEffect = dropEffect;
    },

    destructor: function()
    {
        this.eraseChildren();
        this.erase();
    }
}
