import { Directive, ElementRef } from "@angular/core";

@Directive({selector:'[tooltip]'})
export class TooltipDirective{
    constructor(el:ElementRef){
        // 提示框
        var tooltip=el.nativeElement;
        // 提示框的父元素
        var tooltipParent=el.nativeElement.parentNode;
        el.nativeElement.style.display = 'none';
        el.nativeElement.parentNode.onmouseenter=function(){
            el.nativeElement.style.display = 'block';
           
            var borderWidht = parseInt(tooltipParent.style.borderWidth);
            var top = 0,left = tooltipParent.clientWidth+borderWidht;
            //console.log(left);
            //  如果父元素到浏览器顶部的距离小于提示框的高度，提示框就显示在父元素的下方，
            if(tooltipParent.offsetTop-document.documentElement.scrollTop<tooltip.ClientHeight){
                top = borderWidht? tooltipParent.clientHeight+borderWidht :tooltipParent.clientHeight;
            }
            //  如果父元素到浏览器左侧的距离小于提示框的宽度，提示框就是显示在父元素的右侧
            if(tooltipParent.offsetLeft < tooltip.clientWidth){
                left = borderWidht? tooltipParent.clientWidth+borderWidht : tooltipParent.clientWidth;
            }
            //  如果父元素到浏览器右侧的距离小于提示框的宽度，提示框就显示在父元素的左侧
            if(innerHeight - tooltipParent.offsetLeft < tooltip.clientWidth){
                left = borderWidht? -(tooltipParent.clientWidth+borderWidht) : -(tooltipParent.clientWidth);
            }
            //  如果父元素到浏览器底部的距离小于提示框的高度，提示框显示在父元素的上侧
            if(innerHeight - (tooltipParent.offsetTop-document.documentElement.scrollTop) < tooltip.clientHeight){
                top = borderWidht? -(tooltip.clientHeight+borderWidht) : -tooltip.clientHeight;
            }
            tooltipParent.style.position = 'relative';
            tooltip.style.position = 'absolute';
            tooltip.style.top = top+'px';
            tooltip.style.left = left+'px';
            console.log(left,top);
        }
        
        el.nativeElement.parentNode.onmouseleave=function(){
            el.nativeElement.style.display = 'none';
        }
    }
}
