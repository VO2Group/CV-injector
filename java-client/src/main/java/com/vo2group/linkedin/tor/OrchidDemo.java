/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.vo2group.linkedin.tor;

import com.subgraph.orchid.TorClient;
import com.subgraph.orchid.TorInitializationListener;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.net.Socket;
import java.net.URL;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.commons.io.IOUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

public class OrchidDemo {

    private static TorClient client;

    public static void main(String[] args) {
        startOrchid();
    }

    private static void startOrchid() {
        //listen on 127.0.0.1:9150 (default)
        client = new TorClient();
        client.addInitializationListener(createInitalizationListner());
        client.start();
        client.enableSocksListener();//or client.enableSocksListener(yourPortNum);
    }

    private static void stopOrchid() {
        client.stop();
    }

    public static TorInitializationListener createInitalizationListner() {
        return new TorInitializationListener() {
            @Override
            public void initializationProgress(String message, int percent) {
                System.out.println(">>> [ " + percent + "% ]: " + message);
            }

            @Override
            public void initializationCompleted() {
                System.out.println("Tor is ready to go!");
                testOrchidUsingProxyObject();
                //stopOrchid();
            }
        };
    }

    private static void testOrchidUsingProxyObject() {
        Thread thread = new Thread() {
            @Override
            public void run() {
                try {
                    //Caution: Native Java DNS lookup will occur outside of the tor network.  
                    //Monitor traffic on port 53 using tcpdump or equivalent.
                    URL url = new URL("https://wtfismyip.com/");
                    Proxy proxy = new Proxy(Proxy.Type.SOCKS, new InetSocketAddress("localhost", 9150));
                    HttpURLConnection uc = (HttpURLConnection) url.openConnection(proxy);
                    uc.setConnectTimeout(10000);
                    Document document = Jsoup.parse(IOUtils.toString(uc.getInputStream()));
                    System.out.println(document);
                    String result = document.select("div[id=tor").text();
                    System.out.println("testOrchidUsingProxyObject: " + result);
                    
                    stopOrchid();
                } catch (Exception ex) {
                    Logger.getLogger(OrchidDemo.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        };
        thread.start();
    }
}