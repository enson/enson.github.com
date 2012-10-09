/* С����̨���ͺϲ�
 * by xiaobian.hxy
 * @ Apr.12 2011
 */

YUI().use('node', 'event', 'overlay', 'io-base', 'json-parse', function(Y){
	var existedRoomTypeList = Y.one('#J_ExistedRoomTypeList');
	
	// �������ͱ༭
	existedRoomTypeList.delegate('mouseover', function(e){
		this.setStyle('background', '#FFFFD3');
	}, 'span.room-type-item');
	
	existedRoomTypeList.delegate('mouseout', function(e){
		this.setStyle('background', '#FFF');
	}, 'span.room-type-item');
	
	// �༭��������
	existedRoomTypeList.delegate('click', function(e){
		if (this.hasClass('room-type-item')) {
			//console.log();
			this.addClass('hidden');
			this.next('span.room-type-item-edit').removeClass('hidden');
		}
	}, 'span');
	
	// �ύ��ȡ���������Ƹ���	
	existedRoomTypeList.delegate('click', function(e){
		if (this.hasClass('J_EditConfirmBtn')) { // �ύ����
			var nRoomTypeTitleEdit = this.ancestor('span');
			var nRoomTypeTitle = nRoomTypeTitleEdit.previous('span.room-type-item');
			var rid = nRoomTypeTitle.previous('input').get('value');
			var rname = this.previous('input.edit-title').get('value');
			var uri = '/hotelx/remote/updateRtpName.do?id=' + rid + '&name=' + rname;

			// �ύ�ɹ�
			function onSuccess(id, o, args) {
				if (eval(o.responseText)) { // �޸ĳɹ�
					nRoomTypeTitleEdit.addClass('hidden');
					nRoomTypeTitle.one('label').set('innerHTML', rname);
					nRoomTypeTitle.removeClass('hidden');
				} else { // �޸�ʧ��
					alert('�޸ķ�������ʧ�ܣ����Ժ�����ύ�޸ġ�');
				}
			};
			
			// �ύʧ��
			function onFailure(id, o, arg) {
				alert('�ύʧ�ܣ����Ժ�����ύ��');
			};
			
			var cfg = {
				on: {
					success: onSuccess,
					failure: onFailure
				}
			};
			
			var request = Y.io(uri, cfg);			
		} else if (this.hasClass('J_EditCancelBtn')) { // ȡ������
			var nRoomTypeTitleEdit = this.ancestor('span');
			var nRoomTypeTitle = nRoomTypeTitleEdit.previous('span.room-type-item');
			
			nRoomTypeTitleEdit.addClass('hidden');
			this.previous('input.edit-title').set('value', nRoomTypeTitle.one('label').get('innerHTML'));
			nRoomTypeTitle.removeClass('hidden');
		}
	}, 'input');
	
	/* �ϲ����͵����� */
	/* BEGIN */
	
	// ����������ڵ�ṹ
	var nRoomMergeDialog = Y.Node.create(
		'<div class="room-merge-dialog" >' + 
			'<div class="dialog-content" id="J_MergeForm" action="merge-room-type" name="mergeform">' + 
				'<div class="content-selected">' + 
					'<div class="title">��ѡ���ͣ�</div>' + 
					'<ul id="J_RoomSelected">' + 
					'</ul>' + 
					'<div style="clear:both;"></div>' + 
				'</div>' + 
				
				'<div class="content-merge-to">' + 
					'<div class="title">����ѡ���ͺϲ�Ϊ��</div>' +
					'<select name="toid" id="J_RoomMergeTo">' +
					'</select>' + 
					'<span style="color:#808080; margin:0 0 0 5px;">�����̷���Ϊ���ŷ��ͣ����ŷ��Ͳ��ܽ��кϲ���</span>' + 
					'<div style="clear:both;"></div>' + 
				'</div>' + 
				
				'<div class="content-confirm">' + 
					'<input id="J_ContentConfirmBtn" type="button" value="ȷ��"/>' + 
					'<input id="J_ContentCancelBtn" type="button" value="ȡ��"/>' + 
				'</div>' +
			'</div>' + 
		'</div>'
	);
	
	// ����������
	var overlay = new Y.Overlay({
		// headerContent:'My Overlay Header',
		bodyContent: nRoomMergeDialog,
		// footerContent:'My Footer Content',
		centered:true,
		zIndex:10,
		visible:true
	});
	
	// �󶨵����㴥���¼�
	Y.one('#J_MergeRoom').on('click', function(e){
		var nRoomSelected = nRoomMergeDialog.one('#J_RoomSelected');
		var nRoomMergeTo = nRoomMergeDialog.one('#J_RoomMergeTo');
		
		// ����fetchSelectedRoomsToPop����ȡ��Ҫ�ϲ��ķ����б�������
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
					nRoomSelected.append('<li><span class="' + elClass + '" rid="' + rid +'" >' + rname + '</span><a href="#" class="remove-room-type-item">�Ƴ�</a></li>');
				}
			});
		};
		
		// ����fetchSelectedRooms������Ҫ�ϲ��ķ����б������������б�
		var fetchSelectedRooms = function () {
			var nRoomSelectedItems = nRoomSelected.all('li');
			nRoomMergeTo.all('option').remove();
			nRoomMergeTo.append('<option value="-1">(--��ѡ��--)</option>');
			nRoomSelectedItems.each(function(n){
				nRoomMergeTo.append('<option value="' + n.one('span').getAttribute('rid') + '">' + n.one('span').get('innerHTML') + '</option>');
			});											
			nRoomMergeTo.one('option').set('selected', true);	//�ָ�Ĭ�ϲ�ѡ���κ�ѡ��״̬
		};
		
		// �ж��Ƿ��Ѿ�������������
		if (Y.one('div.yui-overlay')) { // �Ѵ���
			Y.one('div.yui-overlay').setStyle('display', 'block');
			nRoomSelected.all('li').remove();

			fetchSelectedRoomsToPop();			
			if (!nRoomSelected.hasChildNodes()) {
				alert('��ѡ����Ҫ�ϲ��ķ���');
				return;
			}
			
			fetchSelectedRooms();
		} else { // δ����
			// overlay.render();			
			fetchSelectedRoomsToPop();
			if (!nRoomSelected.hasChildNodes()) {
				alert('��ѡ����Ҫ�ϲ��ķ���');
				return;
			}
			
			fetchSelectedRooms();
			overlay.render();
			
			// �����㣬���Ƴ������¼�
			nRoomSelected.delegate('click', function(e){
				e.halt();
				this.ancestor('li').remove();
				fetchSelectedRooms();	//�Ƴ�����ʱ�����·����б������б�
			}, 'a');
			
			// �����㣬��ȷ�ϰ�ť
			Y.one('#J_ContentConfirmBtn').on('click', function(e){
				e.halt();
				
				// ƴ����Ҫ�ϲ��ķ��͵�id
				var rids = "";	
				nRoomSelected.all('li').each(function(n){
					var rid = n.one('span').getAttribute('rid');
					rids += rid + '-';
				});
				rids = rids.substring(0, rids.length-1);
				
				// �ύ�ϲ���Ϣ
				if (nRoomMergeTo.get('value') == '-1'){
					alert("��ѡ����Ҫ�ϲ�Ϊ�ķ��͡�");
				} else {
					// �첽�ύ���ͺϲ�
					var mergeToRid = Y.one('#J_RoomMergeTo').get('value');
					var uri = '/hotelx/remote/roomTypeMerge.do?from=' + rids + '&to=' + mergeToRid;
					// �ύ�ɹ����
					function onSuccess(id, o, args) {
						var data = Y.JSON.parse(o.responseText);
						
						if (data.success) { // �ϲ����ͳɹ�
							// ɾ�����ϲ��ķ���
							existedRoomTypeList.all('li').each(function(n){
								if ((n.one('input').get('checked')) && (n.one('input').get('value') != mergeToRid)) {
									n.remove();
								}
							});
							
							Y.one('div.yui-overlay').setStyle('display', 'none');
						} else { // �ϲ�����ʧ��
							alert(data.reason);
						}
					};
					
					// �ύʧ�ܾ��
					function onFailure(id, o, arg) {
						alert('�ύʧ�ܣ����Ժ�����ύ��');
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
			
			// �����㣬��ȡ����ť
			Y.one('#J_ContentCancelBtn').on('click', function(e){
				e.halt();
				Y.one('div.yui-overlay').setStyle('display', 'none');
			});
		}
		
	});
	
	/* �ο����� �첽����  modified by shaobo begin */
	var referenceRoomAjax = {
		
		//���سɹ�������
		_onSuccess:function(id, res, args){
			//var data = Y.JSON.parse(res.responseText);
			//if (data.success){
				args.node.append(res.responseText);
			//}else{
				//alert(data.reason);
			//}
		},
		
		//����ʧ�ܴ�����
		_onFailure:function(){
			//alert('');
		},
		
		//�첽���ص�ַ
		_uri : Y.one('.reference-room-type span') && Y.one('.reference-room-type span').getAttribute('data-uri'),
		
		//����
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
	
	//������reference-website���زο���Ϣ
	Y.all("div.reference-website").each(function(n, i){
		var first = n.one('div.website-title'),
			type = first.getAttribute('data-type'),
			id = Y.one('input[name=hid]').get('value');
		if (!type || !id) return;
		referenceRoomAjax.request(n, "type="+type + '&id=' + id);
	});
	/* �ο����� �첽����  modified by shaobo end */
	
	/* END */
});