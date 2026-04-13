
/********************************************************************/
/*                                                                  */
/*  Copyright (c) 2009-2011 SUNNIC Pte Ltd                          */
/*                                                                  */
/*  This obfuscated code was created using sunnic e2ee js code.     */
/*                                                                  */
/********************************************************************/

var e2ee_rng_state;var e2ee_rng_pool;var e2ee_rng_pptr;function e2ee_z(x){e2ee_rng_pool[e2ee_rng_pptr++]^=x&255;e2ee_rng_pool[e2ee_rng_pptr++]^=(x>>8)&255;e2ee_rng_pool[e2ee_rng_pptr++]^=(x>>16)&255;e2ee_rng_pool[e2ee_rng_pptr++]^=(x>>24)&255;if(e2ee_rng_pptr>=e2ee_rng_psize)e2ee_rng_pptr-=e2ee_rng_psize;};function e2ee_rng_seed_time(){e2ee_z(new Date().getTime());};if(e2ee_rng_pool==null){e2ee_rng_pool=new Array();e2ee_rng_pptr=0;var K;if(navigator.appName=="Netscape"&&navigator.appVersion<"5"&&window.crypto){var z=window.crypto.random(32);for(K=0;K<z.length;++K)e2ee_rng_pool[e2ee_rng_pptr++]=z.charCodeAt(K)&255;}while(e2ee_rng_pptr<e2ee_rng_psize){K=Math.floor(65536*Math.random());e2ee_rng_pool[e2ee_rng_pptr++]=K>>>8;e2ee_rng_pool[e2ee_rng_pptr++]=K&255;}e2ee_rng_pptr=0;e2ee_rng_seed_time();}function e2ee_R(){if(e2ee_rng_state==null){e2ee_rng_seed_time();e2ee_rng_state=e2ee_K();e2ee_rng_state.init(e2ee_rng_pool);for(e2ee_rng_pptr=0;e2ee_rng_pptr<e2ee_rng_pool.length;++e2ee_rng_pptr)e2ee_rng_pool[e2ee_rng_pptr]=0;e2ee_rng_pptr=0;}return e2ee_rng_state.next();};function e2ee_n(bQ){var i;for(i=0;i<bQ.length;++i)bQ[i]=e2ee_R();};function e2ee_P(){};e2ee_P.prototype.aS=e2ee_n;e2ee_P.prototype.de=e2ee_R;