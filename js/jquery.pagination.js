var _flag = true; //解决scroll多次执行事件BUG，不能丢

//分页个体封装
function pagination (eleId,options) {
	var T = this;
	this.container = $('#'+eleId); //分页容器
	this.tip = this.container.find('.dropTip'); //提示信息栏容器

	//默认参数及其介绍
	this.defaults = {
		num:5,		//一次加载个数
		pageCurrent:1,	//当前页 -- 使用者可以自己指定
		pageAll:0, //所有页数，默认为零，需后台传入
		lastCount:0, //加载的最后一页的数据计数，可不用配置，但使用者必须在ajax中回传 eg:me.params.lastCount = data.lists.length;
		ajaxEvent:function(me){  //数据加载接口 -- 使用者自定义数据加载方式
			$.noop();
		},
		tipText : {
			domLoad:'<span><i></i>加载中</span>',
			domNoData:'<span>暂无数据</span>'
		}
	};


	//分页初始化
	this.init(options);
}

//初始化方法
pagination.prototype.init = function(options){
	var T = this;

	//主要配置参数整合
	T.params = $.extend(T.defaults,options);

	//加载数据处理
	T.resetData();
}

//加载数据处理方法
pagination.prototype.resetData = function(){
	var T = this;

	if(this.container.height() >= this.container.find('.i_container').height()){
		T.params.ajaxEvent(T);
	}else{
		T.container.on('scroll',function(){
			if(_flag && $(this).scrollTop() >= $(this).children('.i_container').height() - $(this).height()){
				setTimeout(function(){
					T.params.ajaxEvent(T);
				},500);
				_flag = false;
			}
		});
	}
}

//清空提示信息栏设置方法
pagination.prototype.hideTip = function(){
	this.tip.html('');
}

//无数据提示信息栏设置方法
pagination.prototype.noDataTip = function(T){
	this.tip.html(T.params.tipText.domNoData);
	this.container.unbind();
}

//加载中信息提示栏设置方法
pagination.prototype.loadingTip = function(T){
	this.tip.html(T.params.tipText.domLoad);
}

//外界访问当前页调用方法 -- 外部接口
pagination.prototype.currentPage = function(){
	var pageCount = this.params.pageCurrent -1;
	return pageCount;
}

//外界访问当前已经加载数据条数方法 -- 外部接口
pagination.prototype.currentCount = function(){
	var dataCount = 0;
	var current = parseInt(this.params.pageCurrent) - 1;
	var _num = this.params.num;
	var total = this.params.pageAll;

	if(current <= total){
		if(current < total){
			dataCount = parseInt(current) * parseInt(_num);
		}
		if(current == total){
			dataCount = parseInt(((current)-1)) * parseInt(_num) + parseInt(this.params.lastCount);
		}
	}
	
	return dataCount;
}

