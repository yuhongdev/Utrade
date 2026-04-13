
/********************************************************************/
/*                                                                  */
/*  Copyright (c) 2009-2011 SUNNIC Pte Ltd                          */
/*                                                                  */
/*  This obfuscated code was created using sunnic e2ee js code.     */
/*                                                                  */
/********************************************************************/

function e2ee_S(){this.i=0;this.O=0;this.S=new Array();};function e2ee_x(key){var i,O,K;for(i=0;i<256;++i)this.S[i]=i;O=0;for(i=0;i<256;++i){O=(O+this.S[i]+key[i%key.length])&255;K=this.S[i];this.S[i]=this.S[O];this.S[O]=K;}this.i=0;this.O=0;};function e2ee_ax(){var K;this.i=(this.i+1)&255;this.O=(this.O+this.S[this.i])&255;K=this.S[this.i];this.S[this.i]=this.S[this.O];this.S[this.O]=K;return this.S[(K+this.S[this.i])&255];};e2ee_S.prototype.init=e2ee_x;e2ee_S.prototype.next=e2ee_ax;function e2ee_K(){return new e2ee_S();};var e2ee_rng_psize=256;