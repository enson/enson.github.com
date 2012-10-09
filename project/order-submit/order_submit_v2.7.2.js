/**
 * @author xiaobian.hxy
 * @description ������дҳJS�����߼�
 */

// http://kezhan.trip.taobao.com/remote/getOrderPromotions.do?
//     sellerid=16121613
//     &itemid=13129219905
//     &userid=38096395
//     &paymenttype=1
//     &price=995.00
//     &roomnum=1
//     &checkin=2012-07-23
//     &checkout=2012-07-24
//     &callback=YUI.Env.JSONP.yui_3_3_0_1_134301213440944

// YUI.Env.JSONP.yui_3_3_0_1_134301213440944({
//     promotions: [
//         {
//             outId: "",
//             name: "�����Ż� ȫ������ ���͹���/��ͼ�����붡����Աƾ���ֻ�30Ԫ�绰�� ������ ���ʷ�",
//             discount: "0.00",
//             id: "mjs-16121613_35832078"
//         },
//         {
//             outId: "",
//             name: "�����Ż� ȫ������ ���͹���/��ͼ�����붡����Աƾ���ֻ�30Ԫ�绰�� ������ ",
//             discount: "0.00",
//             id: "mjs-16121613_35832079"
//         }
//     ]
// })

// YUI.Env.JSONP.yui_3_3_0_1_134301213440944({
//     stockRooms: 5,  // 'short', 'full'
//     noRoomDays: ['2012-8-10', '2012-8-11']
//     payNow: 10.00, // ����֧��
//     payDesk: 900.00, // ����֧��
//     promotions: [
//         {
//             outId: "",
//             name: "�����Ż� ȫ������ ���͹���/��ͼ�����붡����Աƾ���ֻ�30Ԫ�绰�� ������ ���ʷ�",
//             discount: "0.00",
//             id: "mjs-16121613_35832078"
//         },
//         {
//             outId: "",
//             name: "�����Ż� ȫ������ ���͹���/��ͼ�����붡����Աƾ���ֻ�30Ԫ�绰�� ������ ",
//             discount: "0.00",
//             id: "mjs-16121613_35832079"
//         }
//     ],
//     priceCalender: 'xxx'    // string
// })
YTRIP.applyConfig({
	combine: true,
	groups:{
		calender: {
			combine: true,
			root: 'apps/et/common/widgets/calendar/',
			modules: {
				'trip-calendar': {
					path: 'js/trip-calendar.v3.1-min.js',
					type: 'js',
					requires: ['trip-calendar-skin','node', 'base-base', 'event-focus', 'event-mouseenter', 'event-outside']
				},
				'trip-calendar-skin': {
					path: 'css/trip-calendar.v3.1-min.css',
					type:'css'
				}
			}
		}
	}
})

YTRIP.use('node-event-delegate', 'dd','anim', 'trip-autocomplete','trip-calendar','node-screen', 'event-focus', 'jsonp', 'trip-placeholder','overlay','io-base','transition', function(Y) {
	var nOrderBooking = Y.one('#J_OrderBooking');
	
	var nPromotionInfo = Y.one('#J_PromotionInfo');
	var nBookingPromotion = Y.one('#J_BookingPromotion');
	var nHiddenPromoText = Y.one('#J_HiddenPromoText');

	var nPayPriceNow = Y.one('#J_PayPriceNow');
	var nPayPriceFrontDesk = Y.one('#J_PayPriceFrontDesk');

	var nTogglePriceCalender = Y.one('#J_TogglePriceCalender');
	var nPriceCalender = Y.one('#J_PriceCalender');

	var nDeferredPayment = Y.one('#J_DeferredPayment');
	var nGuaranteePrice = Y.one('#J_GuaranteePrice');
	var nDeferredPaymentTip = Y.one('#J_DeferredPaymentTip');
	var nGuaranteePriceTip = Y.one('#J_GuaranteePriceTip');

	var nPostscript = Y.one('#J_Postscript');

	var nArrivalTimeStart = Y.one('#J_ArrivalTimeStart');
	var nArrivalTimeEnd = Y.one('#J_ArrivalTimeEnd');

	var nCheckingPhone = Y.one('#J_CheckingPhone');
	var nContactPhone = Y.one('#J_ContactPhone');
	var nAcceptAgreement = Y.one('#J_AcceptAgreement');
	var nBookingSubmit = Y.one('#J_BookingSubmit');

	// �����Ż���Ϣ�����¼۸�
	updatePromotion();

	// placeholder��ʼ�����������ݲ�֧��ԭ��placeholder�������
	Y.TripPlaceholder.init('.J_CustomName');
	Y.TripPlaceholder.init('#J_Postscript');

	// �¼��󶨼���
	nOrderBooking.delegate('click', function(e) {
		var nTarget = e.currentTarget;
		switch (true) {
			case nTarget === nTogglePriceCalender :
				togglePriceCalender();
				break;
			case nTarget === nAcceptAgreement :
				validateAgreement();
				break;
			default:
				return;
		}
	}, '*');

	nOrderBooking.delegate('blur', function(e) {
		var nTarget = e.currentTarget;
		switch (true) {
			case nTarget.hasAttribute('required') && nTarget.hasClass('J_CustomName') :
				validateName(nTarget);
				break;
			case nTarget === nContactPhone :
				validatePhone();
				break;
			default:
				return true;
		}
	}, 'input');

	// ����������츶�����
	if (nDeferredPayment) {
		nDeferredPayment.on('mouseover', function(e) {
			nDeferredPaymentTip.replaceClass('v-hidden', 'v-visible');
		});
		nDeferredPayment.on('mouseout', function(e) {
			nDeferredPaymentTip.replaceClass('v-visible', 'v-hidden');
		});
	}

	// ����ʵ���з�����
	if (nGuaranteePrice) {
		nGuaranteePrice.on('mouseover', function(e) {
			showGuaranteePirceTip();
			clearTimeout(Y.showTipTimer);
			clearTimeout(Y.hideTipTimer);
			Y.showTipTimer = null;
			Y.hideTipTimer = null;
		});
		nGuaranteePrice.on('mouseout', function(e) {
			hideGuaranteePirceTip();
		});

		Y.on('load', function(e) {
			Y.showTipTimer = setTimeout(showGuaranteePirceTip, 1000);
			Y.hideTipTimer = setTimeout(hideGuaranteePirceTip, 4000);
		});
	}

	// textarea maxLength���Լ���ie
	if (Y.UA.ie && Y.UA.ie <= 9) {
		nPostscript.on('keyup', function(e) {
			var maxLength = nPostscript.getAttribute('maxlength');
			if (nPostscript.get('value').length > maxLength) {
				nPostscript.set('value', nPostscript.get('value').slice(0, maxLength));
			}
		});
	}

	nBookingPromotion.on('change', function(e) {
		updatePrice();
	});
	nArrivalTimeStart.on('change', function(e) {
		updateArrivalTimeEnd();
	});
	nArrivalTimeEnd.on('change', function(e) {
		updateArrivalTimeStart();
	});

	nOrderBooking.on('submit', function(e) {
		e.preventDefault();
		if (validateForm()) {
			submitForm();
		}
	});

	function showGuaranteePirceTip() {
		nGuaranteePriceTip && nGuaranteePriceTip.replaceClass('v-hidden', 'v-visible');
	};
	function hideGuaranteePirceTip() {
		nGuaranteePriceTip && nGuaranteePriceTip.replaceClass('v-visible', 'v-hidden');
	};

	/**
	 * @function
	 * @description �����Ż���Ϣ
	 *              �������ݸ�ʽ��
	 *              {"promotions":
	 *                  [
	 *                      {
	 *                          "outId":"m_1500011085286:0",
	 *                          "name":"\u8054\u5a75\u6d4b\u8bd5",
	 *                          "discount":100,
	 *                          "id":"mjs-2049618271_26138"
	 *                      }
	 *                  ]
	 *              }
	 *              �����Ż���Ϣ���ݰ��Ż����ȴӸߵ�������
	 */
	 
	function updatePromotion() {
		var url = '/remote/getOrderPromotions.do?' +
					'sellerid=' + _INSERT_DATA.sellerid +
					'&itemid=' + _INSERT_DATA.itemid +
					'&userid=' + _INSERT_DATA.userid +
					'&paymenttype=' + _INSERT_DATA.paymentType +
					'&price=' + _INSERT_DATA.rawPrice +
					'&roomnum=' + _INSERT_DATA.roomNum +
					'&checkin=' + _INSERT_DATA.checkIn +
					'&checkout=' + _INSERT_DATA.checkOut +
					'&callback={callback}';
		var htmlString = '';
		Y.jsonp(url, function(raw) {
			var i = 0;
			if (raw.promotions && raw.promotions.length) {
				for (i = 0; i < raw.promotions.length; ++i) {
					if (raw.promotions[i].discount == 0) {
						htmlString += '<option value="' + raw.promotions[i].id + '" data-saved="0">' + raw.promotions[i].name + '</option>';
					} else {
						htmlString += '<option value="' + raw.promotions[i].id + '" data-saved="' + raw.promotions[i].discount + '">ʡ' + raw.promotions[i].discount + 'Ԫ��' + raw.promotions[i].name + '</option>';
					}
				}
				htmlString += '<option value="0" data-saved="0">��ʹ���Ż�</option>';
				nBookingPromotion.setContent(htmlString);

				// Ĭ��ѡ�е�һ���Ż���Ϣ�����Żݵģ�
				nBookingPromotion.get('options').item(0).set('selected', true);
				nPromotionInfo.replaceClass('hidden', 'clearfix');
				updatePrice();
			} else {
				nPromotionInfo.replaceClass('clearfix', 'hidden');
			}
		});
	};

	/**
	 * @function
	 * @description ��У��
	 */
	function validateForm() {
		// validate names
		var valid = true;
		var nlCustomNames = Y.all('.J_CustomName');
		nlCustomNames.each(function(nName) {
			if (nName.hasAttribute('required')) {
				valid = validateName(nName) && valid;
			}
		});

		// validate contact phone
		valid = validatePhone() && valid;

		// validate agreenment acception
		valid = validateAgreement() && valid;

		return valid;
	};

	/**
	 * @function
	 * @description У������
	 * @param {Object} nName YUI Node����ҪУ�����ס�������ڵ�
	 * @return {Boolean} У��ͨ�����
	 */
	function validateName (nName) {
		// ȥ��ǰ��ո�
		nName.set('value', nName.get('value').replace(/^\s+|\s+$/g, ''));

		if (!nName.get('value')) {
			nName.ancestor('.J_CustomRoomName').addClass('name-error');
			return false;
		} else {
			nName.ancestor('.J_CustomRoomName').removeClass('name-error');
			return true;
		}
	};

	/**
	 * @function
	 * @description У���ֻ�����
	 * @return {Boolean} У��ͨ�����
	 */
	function validatePhone () {
		// ȥ��ǰ��ո�
		nContactPhone.set('value', nContactPhone.get('value').replace(/^\s+|\s+$/g, ''));

		if (RegExp(nContactPhone.getAttribute('pattern')).test(nContactPhone.get('value')) && nContactPhone.get('value')) {
			nCheckingPhone.removeClass('phone-error');
			return true;
		} else {
			nCheckingPhone.addClass('phone-error');
			return false;
		}
	};

	/**
	 * @function
	 * @description У�鹺����֪
	 * @param {Object} nAgreement YUI Node���󣬹�����֪�ڵ�
	 * @return {Boolean} У��ͨ�����
	 */
	function validateAgreement (nAgreement) {
		if (!nAcceptAgreement.get('checked')) {
			nBookingSubmit.addClass('agreement-error');
			return false;
		} else {
			nBookingSubmit.removeClass('agreement-error');
			return true;
		}
	};

	/**
	 * @function
	 * @description �ύ��������ģ��placeholder inputԪ�ص�value���Ż��İ����µ�������
	 */
	function submitForm () {
		// ����ģ��placehodler��
		if (!Modernizr.input.placeholder) {
			var nlCustomNames = Y.all('.J_CustomName');
			nlCustomNames.each(function(nCustomName) {
				if (nCustomName.getAttribute('placeholder') === nCustomName._node.value) {
					nCustomName.set('value', '');
				}
			});
			if (nPostscript.getAttribute('placeholder') === nPostscript._node.value) {
				nPostscript.set('value', '');
			}
		}

		// �Ż��İ������������ύ��������
		var nSelectedOption = nBookingPromotion.get('options').item(nBookingPromotion.get('selectedIndex'))
		nHiddenPromoText.set('value', nSelectedOption.getContent());

		nOrderBooking.submit();
	};

	/**
	 * @function
	 * @description ����Ӧ�����
	 * @return {Boolean} �Ƿ���³ɹ�
	 * @requires _INSERT_DATA ���д��ҳ���JSON����
	 */
	function updatePrice(){
		var nSelectedOption = nBookingPromotion.get('options').item(nBookingPromotion.get('selectedIndex'))
		if (!nSelectedOption) {
			return false;
		} else {
			var savedMoney = Number(nSelectedOption.getAttribute('data-saved')) || 0.00;
			var rawPrice = Number(_INSERT_DATA.rawPrice);
			var payPriceNow = rawPrice - savedMoney > 0 ? rawPrice - savedMoney : 0;
			nPayPriceNow.setContent(payPriceNow.toFixed(2));
			return true;
		}
	};

	/**
	 * @function
	 * @description չ��/����۸�����
	 */
	 //չ������۸���������Ч��
	/*
	var myAnim = new Y.Anim({
	    node:'#J_PriceCalender',
		to: {
			height: 0,
            opacity: 0		
        },
		easing:'backIn'
	});
	var onEnd = function(){
	    //var node = this.get('node');
        nPriceCalender.setAttribute('class', 'hidden');
	};
	*/
	var content = nPriceCalender.plug(Y.Plugin.NodeFX,{
	    from:{height: 0 },
		to: {
		    height: function(node){
			    return node.get('scrollHeight');
			}
		},
		easing: Y.Easing.easeOut,
		from:{height: 0 },
		duration: 0.3
	});
	
	
	function togglePriceCalender(){

		if (nPriceCalender.hasClass('hidden')) {
			nTogglePriceCalender.setContent('����');
			nPriceCalender.setAttribute('class', 'clearfix booking-price-calender');
		    content.fx.set('reverse', content.fx.get('reverse'));  
            content.fx.run();
			//alert(nPriceCalender.getStyle('height'));
		} else {
			nTogglePriceCalender.setContent('չ��ÿ��۸�');
			//nPriceCalender.setAttribute('class', 'hidden');
			//myAnim.run();
			//myAnim.on('end',onEnd);
			content.fx.set('reverse', !content.fx.get('reverse')); 
            content.fx.run();
		}
	}; 
	

	/**
	 * @function
	 * @description ����������ʱ��
	 */
	function updateArrivalTimeEnd(){
		nArrivalTimeEnd._node.value = Math.min(Number(nArrivalTimeStart.get('value')) + 3, 24);
	};

	/**
	 * @function
	 * @description �������絽��ʱ��
	 */
	function updateArrivalTimeStart(){
		nArrivalTimeStart._node.value = Math.min(Number(nArrivalTimeEnd.get('value')) - 1, Number(nArrivalTimeStart.get('value')));
	};

	/**
	 * @function
	 * @description �������絽��ʱ��
	 * @param {Object} node YUI Node, ��Ըýڵ���Ⱦ������Ϣ
	 * @param {String} message ������Ϣ�İ�
	 * @param {String} [position='bottom'] �����nodeԪ�ر߽����Ⱦλ�ã��Ϸ�ֵ��top, left, bottom, right
	 * @param {number} [offset=0] �����nodeԪ�ر߽����Ⱦλ��ƫ��
	 * @returns {Object} ������ʾ�ڵ㣬YUI Node
	 */
	function renderErrorMessage(node, message, position, offset){
		this.node = node;
		this.message = message;
		this.position = position || 'bottom';
		this.offset = offset || 0;
		
		var nErrorMessage = Y.Node.create(
			'<div class="tt-error-msg">' +
				'<span class="bg error-msg-icon"></span>' + this.message +
			'</div>');
		var msgX = 0;
		var msgY = 0;
		
		Y.one('body').append(nErrorMessage);

		switch (this.position) {
			case 'bottom':
				msgX = this.node.getX();
				msgY = this.node.getY() + this.node.get('offsetHeight') + this.offset;
				break;
			case 'right':
				msgX = this.node.getX() + this.node.get('offsetWidth') + this.offset;
				msgY = this.node.getY() + (this.node.get('offsetHeight') - nErrorMessage.get('offsetHeight')) / 2;
				break;
			case 'top':
				msgX = this.node.getX();
				msgY = this.node.getY() - nErrorMessage.get('offsetHeight') - this.offset;
				break;
			case 'left':
				msgX = this.node.getX() - nErrorMessage.get('offsetWidth') - this.offset;;
				msgY = this.node.getY() + (this.node.get('offsetHeight') - nErrorMessage.get('offsetHeight')) / 2;
				break;
			default:
				void 0;
		}

		nErrorMessage.setXY([msgX, msgY]);
		return nErrorMessage;
	};
	
/* ---begin------added by xijian----------------*/


	//�����޸����ڵ�����ڵ�ṹ
	
	var modifyDateDialog = Y.Node.create(
	/*
		'<div id="modify-date-dialog" class="modify-date-dialog">'+
			'<div class="dialog-header">'+
				'<span class="title">�޸�����</span><span id="dialog-close" class="bg close"></span>'+
			'</div>'+
			'<div class="dialog-body">'+
				'<ul class="dateInput">'+
					'<li class="field-wrap">'+
						'<label>��ס</label>'+
						'<input type="text" class="J_CheckInDateInput"  placeholder="yyyy-mm-dd" name="_fmd.h._0.ch" />'+
					'</li>'+
					'<li class="field-wrap">'+
						'<label>���</label>'+
						'<input type="text" class="J_CheckOutDateInput"  placeholder="yyyy-mm-dd" name="_fmd.h._0.che" />'+
					'</li>'+
					'<li class="field-wrap"><button class="bg field-submit" type="submit"></button></li>'+
				'</ul>'+
				
			'</div>'+
			
		'</div>'
	*/
		
	);
	
	//�����޸����ڵ�����

	var overlay = new Y.Overlay({
		srcNode: "#modify-date-dialog",   
		//bodyContent: modifyDateDialog,
		centered:true,
		zIndex:10004,
		visible:true,
		//xy:[100,100],
		//mask:true
	});
	//overlay.render();
	/*
	var mask = new Y.Overlay({
		srcNode:"#mask-overlay",
		centered:true,
		zIndex:10003,
		visible:true,	
	});
	*/
	//���޸����ڵ����㴥���¼�
	Y.one('#J_ModifyDate').on('click',function(e){
		overlay.render();
		Y.one('#modify-date-dialog').setStyle('display','block');
		Y.one('#mask-overlay').setStyle('display','block');
		
	});
	Y.one('#dialog-close').on('click',function(){
		Y.one('#modify-date-dialog').setStyle('display','none');
		Y.one('#mask-overlay').setStyle('display','none');
		hotelBookingDateSuggest.hide();
	})
	Y.one('#dialog-submit').on('click',function(){
	    //togglePriceCalender();
		//changeBookingDate();
		//updatePrice();
		//checkRoomStatus();
		setTimeout(checkRoomStatus, 600);
		
	});
	
	//�����������
	var hotelBookingDateSuggest = new Y.TripCalendar({
		triggerNode: Y.one('.J_CheckInDateInput'),
		finalTriggerNode: Y.one('.J_CheckOutDateInput'),
		minDate: new Date,
		isDateInfo: false,
		isDateIcon: true,
		isAutoSwitch: true
	}); 
	hotelBookingDateSuggest.get('boundingBox').setStyle('z-index','10005');
	hotelBookingDateSuggest.on('dateclick',function(e){
	    //alert(e.date);
		//Y.one('#checkin-date').setContent(e.date);
		
	});
	
	//placeholder��ʼ��
	Y.TripPlaceholder.init('#J_CheckInDateInput');
	Y.TripPlaceholder.init('#J_CheckOutDateInput'); 
	
	//��������ק
	var dd = new Y.DD.Drag({
		node:'#modify-date-dialog'
	}).addHandle('#dialog-header');
	
	
	//�޸���סʱ����ʾ����
	function changeBookingDate(){
	    var inDate = Y.one('#J_CheckInDateInput').get("value");
		var outDate = Y.one('#J_CheckOutDateInput').get("value");
	    Y.one('#checkin-date').setContent(inDate);
		Y.one('#checkout-date').setContent(outDate);
	};
	
	//չ��ÿ��۸񽥱�
	/*
	Y.one('#J_PriceCalender').transition({
	    duration:2,
		easing: 'ease-out',
		width: {
			delay: 0.75,
			easing: 'ease-in',
		},

		opacity: {
			delay: 1.5,
			duration: 1.25,
			value: 1
		}
	});
	*/
	//���ȷ�Ϻ�У�鷿̬
	function checkRoomStatus(){
	    var inDate = Y.one('#J_CheckInDateInput').get("value");
		var outDate = Y.one('#J_CheckOutDateInput').get("value");
	    var url = './roomValidation.jsonp?'+
		            'checkInDate='+inDate+
					'checkOutDate='+outDate+
					'&callback=handleJSONP';
		
        window.handleJSONP = function(roomStatus){
			//Y.log(roomStatus.result.available);
			if(roomStatus.query.checkInDate == inDate && roomStatus.query.checkOutDate == outDate){
				if(roomStatus.result.available == false ){ 
					var htmlString = roomStatus.result.unavailableDate[0].date +','+ roomStatus.result.unavailableDate[1].date;
					Y.one('#dialog-footer').setStyle('display','block');
					Y.one('#tip-text-time').setContent(htmlString);
				}else{
				    Y.one('#modify-date-dialog').setStyle('display','none');//��ѡ�������з������ȷ�Ϻ󼴹رյ���������ֲ�
		            Y.one('#mask-overlay').setStyle('display','none');
					changeBookingDate();//������ʾ����סʱ��
					updatePrice();
					nPriceCalender.setAttribute('class', 'clearfix booking-price-calender');//չ���۸�����
				
					//togglePriceCalender();
					content.fx.set('reverse', content.fx.get('reverse'));  
                    content.fx.run();
					var items = roomStatus.result.priceCalendar,len = items.length;
					Y.one('#J_StockRoomNum').setContent(items[0].roomNum);//����ʣ�෿������
					var tmp = '';
					for(var i=0;i < len;i++){
						tmp += '<div class="calender-day">'+
									'<div class="day-date top"><time datetime="2012-3-25">'+items[i].dayInfo+'</time></div>'+
									'<div class="day-price"><span class="tt-rmb">&yen;</span><span class="price">'+items[i].price+'</span><br>'+items[i].breakfast+'</div>'+
								'</div>' ;   
					};
					nPriceCalender.setContent(tmp);
					var tmp = null;
				};
			}else{
			    Y.one('#dialog-footer').setStyle('display','none');
			};
		};
		Y.jsonp(url, handleJSONP);
	};

	
	
/* ---end------added by xijian---------------------*/	
	
});






