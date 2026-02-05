+ Vertically Scaling an application => Adding more resources (i.e. Ram, disk space, GPU ... ) to a server/computer.
+ Horizontally Scaling an application => Setting up more servers to perform the same task.
+ Load Balancer => Perform distribution of requests, Load balancers act as [**reverse proxys**](https://www.strongdm.com/blog/difference-between-proxy-and-reverse-proxy#:~:text=A%20traditional%20forward%20proxy%20server,on%20behalf%20of%20multiple%20servers.) to our servers, intercepting client requests before they get to the server and redirecting that request to the corresponding server.

+ "I have 2 kinds of problems. Urgent and Important. The urgent is never important. The important is never urgent " - Eisenhower's Matrix
+ Software Behavior : Urgent but rarely important
+ Software Architecture : Important but rarely urgent
+ There are 4 levels:
	+ 1 - Urgent and Important
	+ 2 - Not Urgent and Important
	+ 3 - Urgent and Not Important
	+ 4 - Not Urgent and Not Important

+ Architecture of the code (important stuff) => level 1 and 2
+ Behavior of the code => level 1 and 3

### A good architecture must support:
	+ The use cases and operation of the system.
	+ The maintenance of the system.
	+ The development of the system.
	+ The deployment of the system.

[]![[Clean-Architecture.png]]
