
/********************************************************************/
/*                                                                  */
/*  Copyright (c) 2009-2011 SUNNIC Pte Ltd                          */
/*                                                                  */
/*  This obfuscated code was created using sunnic e2ee js code.     */
/*                                                                  */
/********************************************************************/

var e2ee_b64map="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var e2ee_b64pad="=";function e2ee_aR(J){var i;var c;var G="";for(i=0;i+3<=J.length;i+=3){c=parseInt(J.substring(i,i+3),16);G+=e2ee_b64map.charAt(c>>6)+e2ee_b64map.charAt(c&63);}if(i+1==J.length){c=parseInt(J.substring(i,i+1),16);G+=e2ee_b64map.charAt(c<<2);}else if(i+2==J.length){c=parseInt(J.substring(i,i+2),16);G+=e2ee_b64map.charAt(c>>2)+e2ee_b64map.charAt((c&3)<<4);}while((G.length&3)>0)G+=e2ee_b64pad;return G;};function e2ee_O(s){var G="";var i;var H=0;var ak;for(i=0;i<s.length;++i){if(s.charAt(i)==e2ee_b64pad)break;R=e2ee_b64map.indexOf(s.charAt(i));if(R<0)continue;if(H==0){G+=e2ee_c(R>>2);ak=R&3;H=1;}else if(H==1){G+=e2ee_c((ak<<2)|(R>>4));ak=R&0xf;H=2;}else if(H==2){G+=e2ee_c(ak);G+=e2ee_c(R>>2);ak=R&3;H=3;}else{G+=e2ee_c((ak<<2)|(R>>4));G+=e2ee_c(R&0xf);H=0;}}if(H==1)G+=e2ee_c(ak<<2);return G;};function e2ee_bL(s){var J=e2ee_O(s);var i;var a=new Array();for(i=0;2*i<J.length;++i){a[i]=parseInt(J.substring(2*i,2*i+2),16);}return a;}