/* 小二后台房型合并
 * by xiaobian.hxy
 * @ Apr.12 2011
 */

YUI().use('node', 'event', 'overlay', 'io-base', 'json-parse', function(Y){
	var existedRoomTypeList = Y.one('#J_ExistedRoomTypeList');
	
	// 高亮房型编辑
	existedRoomTypeList.delegate('mouseover', function(e){
		this.setStyle('background', '#FFFFD3');
	}, 'span.room-type-item');
	
	existedRoomTypeList.delegate('mouseout', function(e){
		this.setStyle('background', '#FFF');
	}, 'span.room-type-item');
	
	// 编辑房型名称
	existedRoomTypeList.delegate('click', function(e){
		if (this.hasClass('room-type-item')) {
			//console.log();
			this.addClass('hidden');
			this.next('span.room-type-item-edit').removeClass('hidden');
		}
	}, 'span');
	
	// 提交或取消房型名称更改	
	existedRoomTypeList.delegate('click', function(e){
		if (this.hasClass('J_EditConfirmBtn')) { // 提交更改
			var nRoomTypeTitleEdit = this.ancestor('span');
			var nRoomTypeTitle = nRoomTypeTitleEdit.previous('span.room-type-item');
			var rid = nRoomTypeTitle.previous('input').get('value');
			var rname = this.previous('input.edit-title').get('value');
			var uri = '/hotelx/remote/updateRtpName.do?id=' + rid + '&name=' + rname;

			// 提交成功
			function onSuccess(id, o, args) {
				if (eval(o.responseText)) { // 修改成功
					nRoomTypeTitleEdit.addClass('hidden');
					nRoomTypeTitle.one('label').set('innerHTML', rname);
					nRoomTypeTitle.removeClass('hidden');
				} else { // 修改失败
					alert('修改房型名称失败！请稍候从新提交修改。');
				}
			};
			
			// 提交失败
			function onFailure(id, o, arg) {
				alert('提交失败！请稍候从新提交。');
			};
			
			var cfg = {
				on: {
					success: onSuccess,
					failure: onFailure
				}
			};
			
			var request = Y.io(uri, cfg);			
		} else if (this.hasClass('J_EditCancelBtn')) { // 取消更改
			var nRoomTypeTitleEdit = this.ancestor('span');
			var nRoomTypeTitle = nRoomTypeTitleEdit.previous('span.room-type-item');
			
			nRoomTypeTitleEdit.addClass('hidden');
			this.previous('input.edit-title').set('value', nRoomTypeTitle.one('label').get('innerHTML'));
			nRoomTypeTitle.removeClass('hidden');
		}
	}, 'input');
	
	/* 合并房型弹出层 */
	/* BEGIN */
	
	// 创建弹出层节点结构
	var nRoomMergeDialog = Y.Node.create(
		'<div class="room-merge-dialog" >' + 
			'<div class="dialog-content" id="J_MergeForm" action="merge-room-type" name="mergeform">' + 
				'<div class="content-selected">' + 
					'<div class="title">已选房型：</div>' + 
					'<ul id="J_RoomSelected">' + 
					'</ul>' + 
					'<div style="clear:both;"></div>' + 
				'</div>' + 
				
				'<div class="content-merge-to">' + 
					'<div class="title">将已选房型合并为：</div>' +
					'<select name="toid" id="J_RoomMergeTo">' +
					'</select>' + 
					'<span style="color:#808080; margin:0 0 0 5px;">（标绿房型为航信房型，航信房型不能进行合并）</span>' + 
					'<div style="clear:both;"></div>' + 
				'</div>' + 
				
				'<div class="content-confirm">' + 
					'<input id="J_ContentConfirmBtn" type="button" value="确定"/>' + 
					'<input id="J_ContentCancelBtn" type="button" value="取消"/>' + 
				'</div>' +
			'</div>' + 
		'</div>'
	);
	
	// 创建弹出层
	var overlay = new Y.Overlay({
		// headerContent:'My Overlay Header',
		bodyContent: nRoomMergeDialog,
		// footerContent:'My Footer Content',
		centered:true,
		zIndex:10,
		visible:true
	});
	
	// 绑定弹出层触发事件
	Y.one('#J_MergeRoom').on('click', function(e){
		var nRoomSelected = nRoomMergeDialog.one('#J_RoomSelected');
		var nRoomMergeTo = nRoomMergeDialog.one('#J_RoomMergeTo');
		
		// 函数fetchSelectedRoomsToPop，获取需要合并的房型列表到弹出层
		var fetchSelectedRoomsToPop = function() {
			existedRoomTypeList.all('li').each(function(n){
				var rid, elClass;
				if (n.one('input').get('checked')) {
					rid = n.one('input').get('value');
					rname = n.one('span>label').get('innerHTML');
					if (n.one('span>label').hasClass('hang-xin')) {
						elClass = "hang-xin";
					} else {
						elClass = "";
					}
					nRoomSelected.append('<li><span class="' + elClass + '" rid="' + rid +'" >' + rname + '</span><a href="#" class="remove-room-type-item">移除</a></li>');
				}
			});
		};
		
		// 函数fetchSelectedRooms，更新要合并的房型列表到弹出层下拉列表
		var fetchSelectedRooms = function () {
			var nRoomSelectedItems = nRoomSelected.all('li');
			nRoomMergeTo.all('option').remove();
			nRoomMergeTo.append('<option value="-1">(--请选择--)</option>');
			nRoomSelectedItems.each(function(n){
				nRoomMergeTo.append('<option value="' + n.one('span').getAttribute('rid') + '">' + n.one('span').get('innerHTML') + '</option>');
			});											
			nRoomMergeTo.one('option').set('selected', true);	//恢复默认不选中任何选项状态
		};
		
		// 判断是否已经创建过弹出层
		if (Y.one('div.yui-overlay')) { // 已创建
			Y.one('div.yui-overlay').setStyle('display', 'block');
			nRoomSelected.all('li').remove();

			fetchSelectedRoomsToPop();			
			if (!nRoomSelected.hasChildNodes()) {
				alert('请选择需要合并的房型');
				return;
			}
			
			fetchSelectedRooms();
		} else { // 未创建
			// overlay.render();			
			fetchSelectedRoomsToPop();
			if (!nRoomSelected.hasChildNodes()) {
				alert('请选择需要合并的房型');
				return;
			}
			
			fetchSelectedRooms();
			overlay.render();
			
			// 弹出层，绑定移除房型事件
			nRoomSelected.delegate('click', function(e){
				e.halt();
				this.ancestor('li').remove();
				fetchSelectedRooms();	//移除房型时，更新房型列表到下拉列表
			}, 'a');
			
			// 弹出层，绑定确认按钮
			Y.one('#J_ContentConfirmBtn').on('click', function(e){
				e.halt();
				
				// 拼接需要合并的房型的id
				var rids = "";	
				nRoomSelected.all('li').each(function(n){
					var rid = n.one('span').getAttribute('rid');
					rids += rid + '-';
				});
				rids = rids.substring(0, rids.length-1);
				
				// 提交合并信息
				if (nRoomMergeTo.get('value') == '-1'){
					alert("请选择需要合并为的房型。");
				} else {
					// 异步提交房型合并
					var mergeToRid = Y.one('#J_RoomMergeTo').get('value');
					var uri = '/hotelx/remote/roomTypeMerge.do?from=' + rids + '&to=' + mergeToRid;
					// 提交成功句柄
					function onSuccess(id, o, args) {
						var data = Y.JSON.parse(o.responseText);
						
						if (data.success) { // 合并房型成功
							// 删除被合并的房型
							existedRoomTypeList.all('li').each(function(n){
								if ((n.one('input').get('checked')) && (n.one('input').get('value') != mergeToRid)) {
									n.remove();
								}
							});
							
							Y.one('div.yui-overlay').setStyle('display', 'none');
						} else { // 合并房型失败
							alert(data.reason);
						}
					};
					
					// 提交失败句柄
					function onFailure(id, o, arg) {
						alert('提交失败！请稍候从新提交。');
					};
					
					var cfg = {
						on: {
							success: onSuccess,
							failure: onFailure
						}
					};
					
					var request = Y.io(uri, cfg);
				}
			});
			
			// 弹出层，绑定取消按钮
			Y.one('#J_ContentCancelBtn').on('click', function(e){
				e.halt();
				Y.one('div.yui-overlay').setStyle('display', 'none');
			});
		}
		
	});
	
	/* 参考房型 异步加载  modified by shaobo begin */
	var referenceRoomAjax = {
		
		//加载成功处理方法
		_onSuccess:function(id, res, args){
			//var data = Y.JSON.parse(res.responseText);
			//if (data.success){
				args.node.append(res.responseText);
			//}else{
				//alert(data.reason);
			//}
		},
		
		//加载失败处理方法
		_onFailure:function(){
			//alert('');
		},
		
		//异步加载地址
		_uri : Y.one('.reference-room-type span') && Y.one('.reference-room-type span').getAttribute('data-uri'),
		
		//请求
		request:function(node, args){
			var self = this,
				cfg = {
					on:{
						success:self._onSuccess,
						failure:self._onFailure
					},
					data:args,
					arguments : {
						node:node
					}
				};
			
			Y.io(self._uri, cfg);
		}
	};
	
	//对所有reference-website加载参考信息
	Y.all("div.reference-website").each(function(n, i){
		var first = n.one('div.website-title'),
			type = first.getAttribute('data-type'),
			id = Y.one('input[name=hid]').get('value');
		if (!type || !id) return;
		referenceRoomAjax.request(n, "type="+type + '&id=' + id);
	});
	/* 参考房型 异步加载  modified by shaobo end */
	
	/* END */
});