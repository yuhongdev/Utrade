<%@page import="java.util.*"%>
<%@page import ="java.io.BufferedReader,java.io.InputStreamReader,java.net.URL,java.net.URLConnection,java.text.SimpleDateFormat,java.util.Date,java.net.HttpURLConnection" %>
<%@ page import = "java.lang.management.*" %>
<%@page import="com.n2n.tcplus.info.N2NConstant" %>
<%@ page import = "com.n2n.tcplus.session.HTTPSessionManager" %>

<%!
private static ThreadGroup rootThreadGroup = null;

/**
 * Get the root thread group in the thread group tree.
 * Since there is always a root thread group, this
 * method never returns null.
 *
 * @return		the root thread group
 */
public static ThreadGroup getRootThreadGroup( )
{
	if ( rootThreadGroup != null )
		return rootThreadGroup;

	ThreadGroup tg = Thread.currentThread( ).getThreadGroup( );
	ThreadGroup ptg;
	while ( (ptg = tg.getParent( )) != null )
		tg = ptg;
	rootThreadGroup = tg;
	return tg;
}

/*
 * Get a list of all threads.  Since there is always at
 * least one thread, this method never returns null or
 * an empty array.
 *
 * @return		an array of threads
 */
public static Thread[] getAllThreads()
{
	final ThreadGroup root = getRootThreadGroup( );
	final ThreadMXBean thbean =
		ManagementFactory.getThreadMXBean( );
	int nAlloc = thbean.getThreadCount( );
	int n = 0;
	Thread[] threads = null;
	do
	{
		nAlloc *= 2;
		threads = new Thread[ nAlloc ];
		n = root.enumerate( threads, true );
	} while ( n == nAlloc );
	return java.util.Arrays.copyOf( threads, n );
}

//get all thread by given name
public static Thread[] getThreadList( final String name )
{
	if ( name == null )
		throw new NullPointerException( "Null name" );
	final Thread[] threads = getAllThreads( );
	final Thread[] threadList = new Thread[threads.length];
	int count = 0;
	
	for ( Thread thread : threads ){
		if ( thread.getName( ).equals( name ) ){
			threadList[count++] = thread;
		}
	}
	
	return java.util.Arrays.copyOf( threadList, count );
}

//ThreadInfo
	/**
	 * Get a list of all thread info objects.  Since there is
	 * always at least one thread running, there is always at
	 * least one thread info object.  This method never returns
	 * a null or empty array.
	 *
	 * @return		an array of thread infos
	 */
	public static ThreadInfo[] getAllThreadInfos( )
	{
		final ThreadMXBean thbean =
			ManagementFactory.getThreadMXBean( );
		final long[] ids = thbean.getAllThreadIds( );

		// Get thread info with lock info, when available.
		ThreadInfo[] infos;
		if ( !thbean.isObjectMonitorUsageSupported( ) ||
			!thbean.isSynchronizerUsageSupported( ) )
			infos = thbean.getThreadInfo( ids );
		else
			infos = thbean.getThreadInfo( ids, true, true );

		// Clean nulls from array if threads have died.
		final ThreadInfo[] notNulls = new ThreadInfo[infos.length];
		int nNotNulls = 0;
		for ( ThreadInfo info : infos )
			if ( info != null )
				notNulls[nNotNulls++] = info;
		if ( nNotNulls == infos.length )
			return infos;	// Original had no nulls
		return java.util.Arrays.copyOf( notNulls, nNotNulls );
	}

	public static Thread[] searchByName(String name)
	{

		final Thread[] threads = getAllThreads( );
		final Thread[] threadList = new Thread[threads.length];
		int count = 0;
		
		for ( Thread thread : threads ){
			if ( thread.getName().contains(name)){
				threadList[count++] = thread;
			}
		}
				
		Thread[] tempList = java.util.Arrays.copyOf( threadList, count );
		if(tempList.length > 1){
			java.util.Arrays.sort( tempList,
			new java.util.Comparator<Thread>( )
			{
				public int compare( final Thread t1, final Thread t2 )
				{ 
					return t1.getName().compareTo(t2.getName()); }
			} );
		}
		
		return tempList;
	}

%>

<%
	String thName = request.getParameter("name");
	if (thName == null) thName = "";
	
	String vbKill = request.getParameter("kill");
	if (vbKill == null) vbKill = "N";
	
	String sortName = request.getParameter("search");
	if (sortName == null) sortName = "";
	
	String count = request.getParameter("count");
	if (count == null) count = "";
	
	Thread[] b = null;
	Thread[] totalList = null;
	int iCountTclite = 0;
	int iCountTcplus = 0;
	int iCountTotal = 0;

	//com.n2n.DB.N2NSession oN2NSession = new N2NSession(application);
	//String sWSCurr = oN2NSession.getSetting("WSLB_Curr");
	String sTomcatSvrPort = N2NConstant.getConstant("iMSLServerPort");
	String sSponsor = N2NConstant.getSponsorID();
	
	if(count.length() > 0){
		
		totalList = searchByName("ATPhb");
		
		for(Thread tempThread : totalList){			
			if(tempThread.getName().endsWith("_tc")){
				iCountTcplus++;
			}else{
				iCountTclite++;
			}
		}
		iCountTotal = iCountTcplus + iCountTclite;
	}else{
		if(sortName.length() > 0){
			b = searchByName(sortName);
		}else{
			b = getAllThreads();
		}
	}
	
	Thread[] list = getThreadList(thName);
	ThreadInfo[] thInfo = getAllThreadInfos();
	
%>

<html>
	<body>
		<table cellspacing="0" cellpadding="10" border="1">
		<% if(count.length() > 0) { %>
			<h4>Sponsor ID: <%=sSponsor%></h4>
			<h4>TCLite(ATP):<%=iCountTclite%></h4>
			<h4>ssid(dwr):<%=HTTPSessionManager.getScriptSessionList().size()%></h4>
			<h4>TCPlus(ATP):<%=iCountTcplus%></h4>
			<h4>Total(ATP):<%=iCountTotal%></h4>
		<%}
			if(thName.length() > 0) {
				%>
				<tr>
				<th>Thread Name</th>
				<th>Thread ID</th>
				<th>Thread State</th>
				<th>Thread isAlive</th>
				<th>Thread isInterrupted</th>
				<th>Thread isSuspended</th>
				<th>Thread m_bExecThread</th>
				</tr>
				<%
				for(int i=0; i<list.length; i++){
					//com.n2n.tcplus.thread.QCSocketReceiverThread oQCSocRcvTh = (com.n2n.tcplus.thread.QCSocketReceiverThread) list[i];
					if(vbKill.equals("Y")){
						//oQCSocRcvTh.setExecThread(false);
					}
				%>
				<tr>
					<td align="center"><%=list[i].getName()%></td>
					<td align="center"><%=list[i].getId()%></td>
					<td align="center"><%=list[i].getState()%></td>
					<td align="center"><%=list[i].isAlive()%></td>
					<td align="center"><%=list[i].isInterrupted()%></td>
					<td align="center"><%=thInfo[i].isSuspended()%></td>
				</tr>
				<%}
				
			}else if(b != null){
				//column Thread m_bExecThread will be empty as it only applies to QCSocketReceiverThread
				%>
				<tr>
				<th>Thread Name</th>
				<th>Thread ID</th>
				<th>Thread State</th>
				<th>Thread isAlive</th>
				<th>Thread isInterrupted</th>
				<th>Thread isSuspended</th>
				<th>Thread m_bExecThread</th>
				</tr>
				<% 
				for(int j=0; j<b.length; j++){
				%>
				<tr>
					<td align="center"><%=b[j].getName()%></td>
					<td align="center"><%=b[j].getId()%></td>
					<td align="center"><%=b[j].getState()%></td>
					<td align="center"><%=b[j].isAlive()%></td>
					<td align="center"><%=b[j].isInterrupted()%></td>
					<td align="center"><%=thInfo[j].isSuspended()%></td>
				</tr>
				<%}
			}%>
		</table>
	</body>
</html>
