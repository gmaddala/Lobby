package edu.ucla.sait.lobby;

import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.media.AudioManager;
import android.os.Handler;
import android.os.Message;
import android.os.Handler.Callback;
import android.util.Log;

import com.magtek.mobile.android.scra.MagTekSCRA;


public class CardReader extends CordovaPlugin{

	private String mStringCardDataBuffer = "";
	
	private MagTekSCRA mMTSCRA;
	private Handler mSCRADataHandler = new Handler(new SCRAHandlerCallback());
	private AudioManager mAudioMgr;	
	
	private long mLongTimerInterval;
	private boolean mbAudioConnected;
	private int mIntCurrentVolume;
	private int mIntCurrentStatus;
	private int mIntCurrentDeviceStatus;
	private String mStringDebugData;
	private String mStringAudioConfigResult;
	
	// Message types sent from the BluetoothChatService Handler
	public static final int MESSAGE_STATE_CHANGE = 1;
	public static final int MESSAGE_READ = 2;
	public static final int MESSAGE_WRITE = 3;
	public static final int MESSAGE_DEVICE_NAME = 4;
	public static final int MESSAGE_TOAST = 5;
	public static final int STATUS_IDLE = 1;
	public static final int STATUS_PROCESSCARD = 2;
	
	private CallbackContext callback;
	
	//private TextView mTestTextView;
	
	final headSetBroadCastReceiver mHeadsetReceiver = new headSetBroadCastReceiver();
	final NoisyAudioStreamReceiver mNoisyAudioStreamReceiver = new NoisyAudioStreamReceiver();
	
	@Override
	public void initialize(CordovaInterface cordova, CordovaWebView webView)
	{
		super.initialize(cordova, webView);
	}
	
	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException{
		callback = callbackContext;
		if(action.equals("RunCardReaderListener"))
		{
			mMTSCRA = new MagTekSCRA(mSCRADataHandler);
			mAudioMgr = (AudioManager) cordova.getActivity().getSystemService(Context.AUDIO_SERVICE);	
			InitializeData();
			
			mIntCurrentVolume = mAudioMgr.getStreamVolume(AudioManager.STREAM_MUSIC);
			debugMsg("starting");
			if(!mMTSCRA.isDeviceConnected())
		   {
		        //if(mbAudioConnected)
		        //{
		   		   mMTSCRA.setDeviceType(MagTekSCRA.DEVICE_TYPE_AUDIO);
		     	   openDevice();
		        //}
		   }
			return true;
		}
        else if(action.equals("StopCardReaderListener"))
		{
			//cordova.getActivity().unregisterReceiver(mHeadsetReceiver);
			//cordova.getActivity().unregisterReceiver(mNoisyAudioStreamReceiver);
			if (mMTSCRA != null)
				closeDevice();
            return true;
		}
		
		return false;
	}
	
	@Override
	public void onDestroy() {
		super.onDestroy();
		cordova.getActivity().unregisterReceiver(mHeadsetReceiver);
		cordova.getActivity().unregisterReceiver(mNoisyAudioStreamReceiver);
		if (mMTSCRA != null)
			closeDevice();
	
	}
	
	private void openDevice()
	{
		mMTSCRA.openDevice();
	}
	
	private void closeDevice()
	{
		if(mMTSCRA != null)
			mMTSCRA.closeDevice();
	}
	
	private void debugMsg(String lpstrMessage)
	{
		Log.i("MagTekSCRA.Demo:",lpstrMessage);
		
	}
	
	private void displayResponseData()
    {
 
                String strDisplay="";
 
 
                String strResponse =  mMTSCRA.getResponseData();
                if(strResponse!=null)
                {
                        strDisplay =  strDisplay + "Response.Length=" +strResponse.length()+ "\n";
                }
 
                strDisplay =  strDisplay + "EncryptionStatus=" + mMTSCRA.getEncryptionStatus() + "\n";
                strDisplay =  strDisplay + "SDK.Version=" + mMTSCRA.getSDKVersion() + "\n";
                strDisplay =  strDisplay + "Reader.Type=" + mMTSCRA.getDeviceType() + "\n";
                strDisplay =  strDisplay + "Track.Status=" + mMTSCRA.getTrackDecodeStatus() + "\n";
                strDisplay =  strDisplay + "KSN=" + mMTSCRA.getKSN()+ "\n";
                strDisplay =  strDisplay + "Track1.Masked=" + mMTSCRA.getTrack1Masked() + "\n";
                strDisplay =  strDisplay + "Track2.Masked=" + mMTSCRA.getTrack2Masked() + "\n";
                strDisplay =  strDisplay + "Track3.Masked=" + mMTSCRA.getTrack3Masked() + "\n";
                strDisplay =  strDisplay + "Track1.Encrypted=" + mMTSCRA.getTrack1() + "\n";
                strDisplay =  strDisplay + "Track2.Encrypted=" + mMTSCRA.getTrack2() + "\n";
                strDisplay =  strDisplay + "Track3.Encrypted=" + mMTSCRA.getTrack3() + "\n";
                strDisplay =  strDisplay + "MagnePrint.Encrypted=" + mMTSCRA.getMagnePrint() + "\n";
                strDisplay =  strDisplay + "MagnePrint.Status=" + mMTSCRA.getMagnePrintStatus() + "\n";
                strDisplay =  strDisplay + "Card.IIN=" + mMTSCRA.getCardIIN() + "\n";
                strDisplay =  strDisplay + "Card.Name=" + mMTSCRA.getCardName() + "\n";
                strDisplay =  strDisplay + "Card.Last4=" + mMTSCRA.getCardLast4() + "\n";
                strDisplay =  strDisplay + "Card.ExpDate=" + mMTSCRA.getCardExpDate() + "\n";
                strDisplay =  strDisplay + "Card.SvcCode=" + mMTSCRA.getCardServiceCode() + "\n";
                strDisplay =  strDisplay + "Card.PANLength=" + mMTSCRA.getCardPANLength() + "\n";
                strDisplay =  strDisplay + "Device.Serial=" + mMTSCRA.getDeviceSerial()+ "\n";
                strDisplay =  strDisplay  + "SessionID=" + mMTSCRA.getSessionID() + "\n";
 
                switch(mMTSCRA.getDeviceType()) {
                case MagTekSCRA.DEVICE_TYPE_AUDIO:
                        strDisplay =  strDisplay  + "Card.Status=" + mMTSCRA.getCardStatus() + "\n";
                        strDisplay =  strDisplay  + "Firmware.Partnumber=" + mMTSCRA.getFirmware()+ "\n";
                        strDisplay =  strDisplay  + "MagTek.SN=" + mMTSCRA.getMagTekDeviceSerial()+ "\n";
                        strDisplay =  strDisplay  + "TLV.Version=" + mMTSCRA.getTLVVersion()+ "\n";
                        strDisplay =  strDisplay  + "HashCode=" + mMTSCRA.getHashCode()+ "\n";
                        String tstrTkStatus = mMTSCRA.getTrackDecodeStatus();
                        String tstrTk1Status="01";
                        String tstrTk2Status="01";
                        String tstrTk3Status="01";
 
                        if(tstrTkStatus.length() >=6 ) {
                                tstrTk1Status=tstrTkStatus.substring(0,2);
                                tstrTk2Status=tstrTkStatus.substring(2,4);
                                tstrTk3Status=tstrTkStatus.substring(4,6);
 
                                if (!tstrTk1Status.equalsIgnoreCase("01")
                                                && !tstrTk2Status.equalsIgnoreCase("01")
                                                && !tstrTk3Status.equalsIgnoreCase("01")) {
                                        closeDevice();
                                }
                        }
                        else {
                                closeDevice();
                        }
                        break;
 
                default:
                        break;
 
                };
                if(strResponse != null) {
                        strDisplay =  strDisplay + "Response.Raw=" + strResponse + "\n";
                }
 
                //mTestTextView.setText(strDisplay);
                debugMsg(strDisplay);
                debugMsg("Track 1 Masked- '" + mMTSCRA.getTrack1Masked() + "'");
        
                if(mMTSCRA.getTrack1Masked() == null || mMTSCRA.getTrack1Masked().trim().isEmpty())
                {
                    debugMsg("Did not pickup UID");
                    callback.error("Did not pick up UID");
                }
                else
                {
                    callback.success(mMTSCRA.getTrack1Masked().substring(6, 15));
                }
 
    }
	
	private void maxVolume()
	{
		mAudioMgr.setStreamVolume(AudioManager.STREAM_MUSIC,mAudioMgr.getStreamMaxVolume(AudioManager.STREAM_MUSIC),AudioManager.FLAG_SHOW_UI);	
			    	
	                
	}
	private void minVolume()
	{
		mAudioMgr.setStreamVolume(AudioManager.STREAM_MUSIC,mIntCurrentVolume, AudioManager.FLAG_SHOW_UI);
		
	}
	
	private class SCRAHandlerCallback implements Callback{
		public boolean handleMessage(Message msg){
			try
        	{
            	switch (msg.what) 
            	{
    			case MagTekSCRA.DEVICE_MESSAGE_STATE_CHANGE:
    				switch (msg.arg1) {
    				case MagTekSCRA.DEVICE_STATE_CONNECTED:
    					mIntCurrentStatus = STATUS_IDLE;
    					mIntCurrentDeviceStatus = MagTekSCRA.DEVICE_STATE_CONNECTED;    					
    					maxVolume();
    					break;
    				case MagTekSCRA.DEVICE_STATE_CONNECTING:
    					mIntCurrentDeviceStatus = MagTekSCRA.DEVICE_STATE_CONNECTING;
    					break;
    				case MagTekSCRA.DEVICE_STATE_DISCONNECTED:
    					mIntCurrentDeviceStatus = MagTekSCRA.DEVICE_STATE_DISCONNECTED;
    					minVolume();
    					break;
    				}
    				break;
    			case MagTekSCRA.DEVICE_MESSAGE_DATA_START:
    	        	if (msg.obj != null) 
    	        	{
    	        		//mTestTextView.setText("Card Swiped...");
    	        		debugMsg("Card swiped...");
    	                return true;
    	            }
    				break;  
    			case MagTekSCRA.DEVICE_MESSAGE_DATA_CHANGE:
    	        	if (msg.obj != null) 
    	        	{
    	        		debugMsg("Card swipe successful");
    	        		displayResponseData();
    	        		msg.obj=null;

    	                return true;
    	            }
    				break;  
    			case MagTekSCRA.DEVICE_MESSAGE_DATA_ERROR:
    				//mTestTextView.setText("Card Swipe Error... Please Swipe Again.\n");
    				debugMsg("Card swipe error");
	                return true;
    			default:
    	        	if (msg.obj != null) 
    	        	{
    	                return true;
    	            }
    				break;
            	};
        		
        	}
        	catch(Exception ex)
        	{
        		
        	}
        	
            return false;
		}
		
	}
	
	public class NoisyAudioStreamReceiver extends BroadcastReceiver
    {
    	@Override
    	public void onReceive(Context context, Intent intent)
    	{
    		/* If the device is unplugged, this will immediately detect that action,
    		 * and close the device.
    		 */
    		if(AudioManager.ACTION_AUDIO_BECOMING_NOISY.equals(intent.getAction()))
    		{
            	mbAudioConnected=false;
            	if(mMTSCRA.getDeviceType()==MagTekSCRA.DEVICE_TYPE_AUDIO)
            	{
            		if(mMTSCRA.isDeviceConnected())
            		{
            			closeDevice();
            			//clearScreen();
            		}
            	}
    		}
    	}
    }
	
	public class headSetBroadCastReceiver extends BroadcastReceiver
    {

        @Override
        public void onReceive(Context context, Intent intent) {

            // TODO Auto-generated method stub

        	try
        	{
                String action = intent.getAction();
                //Log.i("Broadcast Receiver", action);
                if( (action.compareTo(Intent.ACTION_HEADSET_PLUG))  == 0)   //if the action match a headset one
                {
                    int headSetState = intent.getIntExtra("state", 0);      //get the headset state property
                    int hasMicrophone = intent.getIntExtra("microphone", 0);//get the headset microphone property
  				    //mCardDataEditText.setText("Headset.Detected=" + headSetState + ",Microphone.Detected=" + hasMicrophone);

                    if( (headSetState == 1) && (hasMicrophone == 1))        //headset was unplugged & has no microphone
                    {
                    	mbAudioConnected=true;
                    }
                    else 
                    {
                    	mbAudioConnected=false;
                    	if(mMTSCRA.getDeviceType()==MagTekSCRA.DEVICE_TYPE_AUDIO)
                    	{
                    		if(mMTSCRA.isDeviceConnected())
                    		{
                    			closeDevice();
                    			//clearScreen();
                    		}
                    	}
                	
                    }

                }           
        		
        	}
        	catch(Exception ex)
        	{
        		
        	}

        }

    }
	
	private void InitializeData() 
	{
	    mMTSCRA.clearBuffers();
		mLongTimerInterval = 0;
		mbAudioConnected=false;
		mIntCurrentVolume=0;
		mIntCurrentStatus = STATUS_IDLE;
		mIntCurrentDeviceStatus = MagTekSCRA.DEVICE_STATE_DISCONNECTED;
		
		mStringDebugData ="";
		mStringAudioConfigResult="";	
	}

}
