sap.ui.define(["sap/ui/thirdparty/jquery","sap/base/Log","sap/ui/model/json/JSONModel","sap/m/MessageBox"],function(e,i,t,s){"use strict";return t.extend("ui5lab.browser.model.SampleModel",{constructor:function(e){this._oResourceBundle=e.getResourceBundle();t.apply(this,arguments);this.setSizeLimit(1e4);setTimeout(function(){this._iStartTime=(new Date).getTime();this._loadLibraries()}.bind(this),0);return this},loaded:function(){if(!this._oSamplesLoadedPromise){this._oSamplesLoadedPromise=new Promise(function(e,i){this._fnSamplesLoadedResolve=e;this._fnSamplesLoadedReject=i}.bind(this))}return this._oSamplesLoadedPromise},_loadLibraries:function(){var i=new Promise(function(i,t){e.ajax(sap.ui.require.toUrl("ui5lab/browser/libraries.json"),{dataType:"json",success:function(e){var t=e.libraries;this._oMetadata={};this._iLibraryCount=t.length;this._iLibraryLoadedCount=0;if(t.length>0){for(var a=0;a<t.length;a++){this._loadSamples(t[a],i)}}else{s.information(this._oResourceBundle.getText("noLibrariesConfigured"));i()}}.bind(this),error:t})}.bind(this));i.then(this._onMetadataLoaded.bind(this),this._onError.bind(this))},_loadSamples:function(t,s,a){var r=sap.ui.require.toUrl("libs/"+t.replace(/\./g,"/")+"/index.json");e.ajax({url:r,dataType:"json",success:function(e){this._oMetadata[t]=e[t];this._iLibraryLoadedCount++}.bind(this),error:function(){i.warning(this._oResourceBundle.getText("noMetadataForLibrary",t));this._iLibraryCount--}.bind(this),complete:function(){if(this._iLibraryCount===this._iLibraryLoadedCount){s()}}.bind(this)})},_onMetadataLoaded:function(){i.info("SampleModel: Loaded all samples in "+((new Date).getTime()-this._iStartTime)+" ms");var e=this._processMetadata(this._oMetadata);this.setProperty("/",e);this.updateBindings(true);this._fnSamplesLoadedResolve()},_processMetadata:function(e){var i={libraries:[],assets:[],samples:[]},t=e;var t=Object.keys(t);for(var s=0;s<t.length;s++){e[t[s]].id=t[s];i.libraries.push(e[t[s]]);var a=Object.keys(e[t[s]].content);for(var r=0;r<a.length;r++){var o=e[t[s]].content[a[r]];o.id=t[s]+"."+o.id;o.library=t[s];i.assets.push(o);for(var n=0;n<o.samples.length;n++){var d=o.samples[n];d.id=o.id+"."+d.id;d.asset=o.id;d.library=t[s];i.samples.push(d)}}}return i},_onError:function(e){e.error="Failed to load the metadata, check for parse errors";this.fireRequestFailed({response:e});this._fnSamplesLoadedReject()}})});