// Class with the main function should be named "HelloWorld"
class Main{
  	public void func(){
      System.out.println("Hello from func");
    }
}
class HelloWorld{ 
  
    public static void main(String[] args){
        System.out.println("Hello World!");
      	var obj = new Main();
      	obj.func();
    }
}