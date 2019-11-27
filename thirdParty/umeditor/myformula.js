
var UMeditor = null;    //当前操作实例对象

function umInit(editorName,option){ //初始化一个编辑器实例
    var umObj = null;
    var defaultOption = { 
        toolbar: ['bold italic underline  | myformula '],
        zIndex : 100, 
        autoFloatEnabled: false,
        topOffset: 400,
        autoClearinitialContent: true,
        initialFrameWidth: 500, //初始化编辑器宽度,默认500
        initialFrameHeight: 70  //初始化编辑器高度,默认500
    };
    if(!option){
        option = defaultOption;
    }else{ 
        Object.assign(defaultOption,option); //替换用户自定义初始化参数 
        option = defaultOption;
    } 
    umObj = UM.getEditor(editorName,option);
    umObj.setContent('');  

    return umObj;
}

// UM 创建 “myformula” 组件
UM.registerUI('myformula',function(name) {
    var me = this;
    var $btn = $.eduibutton({
        icon : 'myformula',
        title: me.options.lang === 'zh-cn' ? '数学公式' : 'myformula',
        click : function(){   
            if(UMeditor){
                UMeditor = null;
            }
            UMeditor = me;
            showFormula(); 
        },
        title: '数学公式'
    });

    this.addListener('focus',function(){    //编辑器聚焦时显示工具栏
        $(me.container).find('.edui-btn-toolbar').show();
    });
    this.addListener('blur',function(){     //编辑器失去聚焦时隐藏工具栏
        $(me.container).find('.edui-btn-toolbar').hide();
    });

    this.addListener('selectionchange',function(){
        //切换为不可编辑时，把自己变灰
        var state = this.queryCommandState(name);
        $btn.edui().disabled(state == -1).active(state == 1)
    });
    return $btn;
}
);

//myformula
UM.plugins["myformula"] = function () {
    UM.commands[ "myformula"] = {
        execCommand: function (cmdName) {
            //在这里实现具体的命令的行为
            //当调用 editor.execCommand(“myformula”) 时， 该方法就会被调用
            alert("数学公式");
        },
        queryCommandState: function (cmdName) { 
            
            return 0;
        },
        notNeedUndo: 1

    };

}; 

//显示公式编辑框
function showFormula() {        
    if(!($('body').find('.math-editor-box').length > 0)) {
        //插入编辑框 
        $('body').append('<div class="math-editor-box">\
                                <div class="math-editor-bg"></div>\
                                <div class="math-editor">\
                                    <div id="math-choose"></div>\
                                    <textarea name="mathEditor" id="mathJax" cols="30" rows="10"></textarea>\
                                    <div class="math-view"></div>\
                                    <div class="loader"></div>\
                                    <div class="confirm-btn"><span>插入公式</span></div>\
                                </div> \
                            </div>'); 
        
        var mathChooseHtml = `  <div class="math-tool" v-if="">
                                    <div class="math-tool-select-box">
                                        <div class="toolbar" style="z-index:21">
                                            <div class="panel" id="panel11" style="height: 28px;  position: relative;">
                                            <img src="./imgs/latex/operators.gif" width="168" height="140" border="0" title="Operators" alt="Operators Panel" usemap="#operators_map">
                                            <map name="operators_map" id="operators_map">
                                                <area shape="rect" alt="" title="superscript" coords="0,0,25,25" onclick="editorInsert('^{}',2,0)">
                                                <area shape="rect" alt="" title="subscript" coords="0,28,25,53" onclick="editorInsert('_{}',2,0)">
                                                <area shape="rect" alt="" coords="0,56,25,81" onclick="editorInsert('_{}^{}',2,0)" title="x_a^b">
                                                <area shape="rect" alt="" coords="0,84,25,109" onclick="editorInsert('{_{}}^{}',1)" title="{x_a}^b">
                                                <area shape="rect" alt="" title="_{a}^{b}\\textrm{C}" coords="0,112,25,137" onclick="editorInsert('_{}^{}\\\\textrm{}',2,14)">
                                                <area shape="rect" alt="" title="fraction" coords="28,0,53,25" onclick="editorInsert('\\\\frac{}{}',6)">
                                                <area shape="rect" alt="" title="tiny fraction" coords="28,28,53,53" onclick="editorInsert('\\\\tfrac{}{}',7)">
                                                <area shape="rect" alt="" coords="28,56,53,81" onclick="editorInsert('\\\\frac{\\\\partial }{\\\\partial x}',15)" title="\\\frac{\\\partial }{\\\partial x}">
                                                <area shape="rect" alt="" coords="28,84,53,109" onclick="editorInsert('\\\\frac{\\\\partial^2 }{\\\\partial x^2}',17)" title="\frac{\partial^2 }{\partial x^2}">
                                                <area shape="rect" alt="" coords="28,112,53,137" onclick="editorInsert('\\\\frac{\\\\mathrm{d} }{\\\\mathrm{d} x}',17)" title="\frac{\mathrm{d} }{\mathrm{d} x}">
                                                <area shape="rect" alt="" coords="56,0,81,25" title="\int" onclick="editorInsert('\\\\int')">
                                                <area shape="rect" alt="" title="\int_{}^{}" coords="56,28,81,53" onclick="editorInsert('\\\\int_{}^{}',6,1000)">
                                                <area shape="rect" alt="" coords="56,56,81,81" onclick="editorInsert('\\\\oint')" title="\oint">
                                                <area shape="rect" alt="" title="\oint_{}^{}" coords="56,84,81,109" onclick="editorInsert('\\\\oint_{}^{}',7,1000)">
                                                <area shape="rect" alt="" title="\iint_{}^{}" coords="56,112,81,137" onclick="editorInsert('\\\\iint_{}^{}',7,1000)">
                                                <area shape="rect" alt="" coords="84,0,109,25" title="\bigcap" onclick="editorInsert('\\\\bigcap')">
                                                <area shape="rect" alt="" title="\bigcap_{}^{}" coords="84,28,109,53" onclick="editorInsert('\\\\bigcap_{}^{}',9,1000)">
                                                <area shape="rect" alt="" coords="84,56,109,81" onclick="editorInsert('\\\\bigcup')" title="\bigcup">
                                                <area shape="rect" alt="" title="\bigcup_{}^{}" coords="84,84,109,109" onclick="editorInsert('\\\\bigcup_{}^{}',9,1000)">
                                                <area shape="rect" alt="" title="\lim_{x \to 0}" coords="84,112,109,137" onclick="editorInsert('\\\\lim_{}')">
                                                <area shape="rect" alt="" coords="112,0,137,25" title="\sum" onclick="editorInsert('\\\\sum',6)">
                                                <area shape="rect" alt="" title="\sum_{}^{}" coords="112,28,137,53" onclick="editorInsert('\\\\sum_{}^{}',6)">
                                                <area shape="rect" alt="" title="\sqrt{}" coords="112,56,137,81" onclick="editorInsert('\\\\sqrt{}',6,6)">
                                                <area shape="rect" alt="" title="\sqrt[]{}" coords="112,84,137,109" onclick="editorInsert('\\\\sqrt[]{}',6,8)">
                                                <area shape="rect" alt="" coords="140,0,165,25" title="\prod" onclick="editorInsert('\\\\prod')">
                                                <area shape="rect" alt="" title="\prod_{}^{}" coords="140,28,165,53" onclick="editorInsert('\\\\prod_{}^{}',7,1000)">
                                                <area shape="rect" alt="" coords="140,56,165,81" title="\coprod" onclick="editorInsert('\\\\coprod')">
                                                <area shape="rect" alt="" title="\coprod_{}^{}" coords="140,84,165,109" onclick="editorInsert('\\\\coprod_{}^{}',9,1000)">
                                            </map>
                                        </div>
                                        <div class="panel" id="panel16" style="height: 34px; position: relative;display:none;">
                                            <img src="./imgs/latex/symbols.gif" width="68" height="136" border="0" title="Symbols" alt="Symbols Panel" usemap="#symbols_map">
                                            <map name="symbols_map" id="symbols_map">
                                                <area shape="rect" alt=""  :coords="item.coords" :title="item.title" v-for="(item,index) in symbolsMap" :key="item.title" onclick="editorInsert(item.title)"> 
                                            </map>
                                        </div>
                                        <div class="panel" id="panel4" style="height: 34px;position: relative;display:none;">
                                            <img src="./imgs/latex/binary.gif" width="68" height="238" border="0" title="Binary" alt="Binary Panel" usemap="#binary_map">
                                            <map name="binary_map" id="binary_map">
                                                <area shape="rect" :coords="item.coords" :title="item.title" v-for="(item,index) in binaryMap" :key="item.title" onclick="editorInsert(item.title)"> 
                                            </map>
                                        </div>
                                        <div class="panel" id="panel1" style="height: 34px;position: relative;">
                                            <img src="./imgs/latex/accents.gif" width="34" height="119" border="0" title="Accents" alt="Accents Panel" usemap="#accents_map">
                                            <map name="accents_map" id="accents_map">
                                                <area shape="rect" alt="" coords="0,0,14,14" onclick="editorInsert('{}\\'')" title="a'">
                                                <area shape="rect" alt="" coords="0,17,14,31" onclick="editorInsert('\\\\dot{}')" title="\dot{a}">
                                                <area shape="rect" alt="" coords="0,34,14,48" onclick="editorInsert('\\\\hat{}')" title="\hat{a}">
                                                <area shape="rect" alt="" coords="0,51,14,65" onclick="editorInsert('\\\\grave{}')" title="\grave{a}">
                                                <area shape="rect" alt="" coords="0,68,14,82" onclick="editorInsert('\\\\tilde{}')" title="\tilde{a}">
                                                <area shape="rect" alt="" coords="0,85,14,99" onclick="editorInsert('\\\\bar{}')" title="\bar{a}">
                                                <area shape="rect" alt="" coords="0,102,14,116"  onclick="editorInsert('\\\\not{}')" title="\not{a}">
                                                <area shape="rect" alt="" coords="17,0,31,14" onclick="editorInsert('{}\\'\\'')" title="a''">
                                                <area shape="rect" alt="" coords="17,17,31,31" onclick="editorInsert('\\\\ddot{}')" title="\ddot{a}">
                                                <area shape="rect" alt="" coords="17,34,31,48" onclick="editorInsert('\\\\check{}')" title="\check{a}">
                                                <area shape="rect" alt="" coords="17,51,31,65" onclick="editorInsert('\\\\acute{}')" title="\acute{a}">
                                                <area shape="rect" alt="" coords="17,68,31,82" onclick="editorInsert('\\\\breve{}')" title="\breve{a}">
                                                <area shape="rect" alt="" coords="17,85,31,99" onclick="editorInsert('\\\\vec{}')" title="\vec{a}">
                                                <area shape="rect" alt="" title="degrees" coords="17,102,31,116" onclick="editorInsert('^{\\\\circ}',0)">
                                            </map>
                                        </div> 
                                        <div class="panel" id="panel5" style="height: 28px;  position: relative;">
                                            <img src="./imgs/latex/brackets.gif" width="56" height="140" border="0" title="Brackets" alt="Brackets Panel" usemap="#brackets_map">
                                        <map name="brackets_map" id="brackets_map">
                                            <area shape="rect" alt="" title="\left ( \right )" coords="0,0,25,25" onclick="editorInsert('\\\\left (  \\\\right )',8)">
                                            <area shape="rect" alt="" title="\left ( \right )" coords="0,28,25,53" onclick="editorInsert('\\\\left [  \\\\right ]',8)">
                                            <area shape="rect" alt="" title="\left\{ \right\}" coords="0,56,25,81" onclick="editorInsert('\\\\left \\\\{  \\\\right \\\\}',9)">
                                            <area shape="rect" alt="" title="\left | \right |" coords="0,84,25,109" onclick="editorInsert('\\\\left |  \\\\right |',8)">
                                            <area shape="rect" alt="" title="\left \{ \right." coords="0,112,25,137" onclick="editorInsert('\\\\left \\\\{  \\\\right.',9)">
                                            <area shape="rect" alt="" title="\left \| \right \|" coords="28,0,53,25" onclick="editorInsert('\\\\left \\\\|  \\\\right \\\\|',9)">
                                            <area shape="rect" alt="" title="\left \langle \right \rangle" coords="28,28,53,53" onclick="editorInsert('\\\\left \\\\langle  \\\\right \\\\rangle',14)">
                                            <area shape="rect" alt="" title="\left \lfloor \right \rfloor" coords="28,56,53,81" onclick="editorInsert('\\\\left \\\\lfloor  \\\\right \\\\rfloor',14)">
                                            <area shape="rect" alt="" title="\left \lceil \right \rceil" coords="28,84,53,109" onclick="editorInsert('\\\\left \\\\lceil  \\\\right \\\\rceil',13)">
                                            <area shape="rect" alt="" title="\left. \right \}" coords="28,112,53,137" onclick="editorInsert('\\\\left.  \\\\right \\\\}',7)">
                                        </map>
                                        </div>
                                        <div class="panel" id="panel8" style="height: 34px;  position: relative;display:none;">
                                            <img src="./imgs/latex/greeklower.gif" width="68" height="136" border="0" title="Greeklower" alt="Greeklower Panel" usemap="#greeklower_map">
                                        <map name="greeklower_map" id="greeklower_map"> 
                                            <area shape="rect" alt="" :coords="item.coords" :title="item.title" v-for="(item,index) in greeklowerMap" :key="item.title" onclick="editorInsert(item.title)">
                                        </map>
                                        </div>
                                        <div class="panel" id="panel9" style="height: 34px;  position: relative;display:none;">
                                            <img src="./imgs/latex/greekupper.gif" width="34" height="102" border="0" title="Greekupper" alt="Greekupper Panel" usemap="#greekupper_map">
                                        <map name="greekupper_map" id="greekupper_map">
                                            <area shape="rect" alt=""  :coords="item.coords" :title="item.title" v-for="(item,index) in greekupperMap" :key="item.title" onclick="editorInsert(item.title)"> 
                                        </map>
                                        </div>
                                        <div class="panel" id="panel12" style="height: 34px;  position: relative;display:none;">
                                            <img src="./imgs/latex/relations.gif" width="51" height="221" border="0" title="Relations" alt="Relations Panel" usemap="#relations_map">
                                        <map name="relations_map" id="relations_map">
                                            <area shape="rect" alt="" :coords="item.coords" :title="item.title" v-for="(item,index) in relationsMap" :key="item.title" onclick="editorInsert(item.title)">
                                        </map>
                                        </div>
                                        <div class="panel" id="panel3" style="height:34px;display:none;">
                                            <img src="./imgs/latex/arrows.gif" width="56" height="170" border="0" title="Arrows" alt="Arrows Panel" usemap="#arrows_map">
                                            <map name="arrows_map" id="arrows_map">
                                                <area shape="rect" alt="" :coords="item.coords" :title="item.title" v-for="(item,index) in arrowsMap" :key="index" onclick="editorInsert(item.title)"> 
                                            </map>
                                        </div> 
                                        <div class="panel" id="panel15" style="height: 34px; position: relative;display:none;">
                                            <img src="./imgs/latex/subsupset.gif" width="34" height="153" border="0" title="Subsupset" alt="Subsupset Panel" usemap="#subsupset_map">
                                            <map name="subsupset_map" id="subsupset_map">
                                                <area shape="rect" alt="" :coords="item.coords" :title="item.title" v-for="(item,index) in subsupsetMap" :key="index" onclick="editorInsert(item.title)"> 
                                            </map>
                                        </div> 
                                        </div> 
                                    </div>
                                </div>`
        document.getElementById("math-choose").innerHTML = mathChooseHtml;
        $('.panel').mouseover(function(){
            $('.panel').removeClass('show-panel');
            $(this).addClass('show-panel');
        });
        $('.panel').mouseout(function(){
            $('.panel').removeClass('show-panel'); 
        });
    }
    $('.math-editor-box').show();
    $('.math-editor-box #mathJax').val('');
    $('.math-view').text('');   

    //公式渲染预览 
    $('.math-editor-box #mathJax').bind('input propertychange', function(){  
        if($('#mathJax').val() == ''){ 
            $('.math-view').text("");
        }else{
            $('.math-view').text("$"+$('#mathJax').val()+"$");
        } 
        $('.loader').show();
        $('.math-view').hide();
        window.MathJax && window.MathJax.Hub.Queue(["Typeset", MathJax.Hub, document.getElementsByClassName('math-view')],function(){
            $('.loader').hide(); // 公式重新渲染完成后执行这个回调函数
            $('.math-view').show();
        });  
    });  
}

//点击背景关闭编辑器
$('body').on("click",'.math-editor-bg',function(){    
    $('body').find('.math-editor-box').hide();
});  

//将公式插入到文本框中 
$('body').on('click','.math-editor-box .confirm-btn',function(){   
    if($('#mathJax').val() != '') { 
        //var mathtext = "$"+$('#mathJax').val()+"$";  
        $('.math-view span').attr('contenteditable',false);
        var mathHtml = $('.math-view').html();  
        UMeditor.execCommand('inserthtml',"<span contenteditable='false' class='mathTex-insert'>"+ mathHtml + "</span>");    
        $(".edui-container .mathTex-insert").attr('contenteditable',false);
        $('body').find('.math-editor-box').hide(); 
    }  
});

//添加内容到编辑器 
function  editorInsert(mathString) {   
    mathString = $('.math-editor-box #mathJax').val() + mathString;
    $('.math-editor-box #mathJax').val(mathString)
    $('.math-view').text("$"+$('#mathJax').val()+"$");
    $('.math-view').hide();
    $('.loader').show();
    window.MathJax && window.MathJax.Hub.Queue(["Typeset", MathJax.Hub, document.getElementsByClassName('math-view')],function(){
        $('.loader').hide();
        $('.math-view').show(); 
    });  
}