import java.awt.*; 
import java.awt.event.*; 
import java.io.*; 
import java.net.*; 
 
public class Client implements ActionListener { 
 
    private Socket s; 
    private DataInputStream din; 
    private DataOutputStreamdout; 
    private TextFieldtf; 
    private TextArea ta; 
    private Label lb; 
    private Button b; 
 
    public Client() { 
        Frame f = new Frame("Client"); 
f.setLayout(new FlowLayout()); 
f.setBackground(Color.orange); 
tf = new TextField(15); 
        ta = new TextArea(12, 20); 
ta.setBackground(Color.white); 
        lb = new Label("Enter File Name To Be Send"); 
        b = new Button("Send"); 
f.add(lb); 
f.add(tf); 
f.add(b); 
f.add(ta); 
b.addActionListener(this); 
f.setSize(300, 400); 
f.setLocation(300, 300); 
f.setVisible(true); 
 
        try { 
            s = new Socket("localhost", 7860); 
System.out.println(s); 
            din = new DataInputStream(s.getInputStream()); 
dout = new DataOutputStream(s.getOutputStream()); 
        } catch (Exception e) { 
System.out.println(e); 
        } 
 
f.addWindowListener(new WindowAdapter() { 
            public void windowClosing(WindowEvent we) { 
                try { 
s.close(); 
                } catch (IOException e) { 
e.printStackTrace(); 
                } 
System.exit(0); 
            } 
        }); 
    } 
 
    public void actionPerformed(ActionEvent ae) { 
        String fileName = tf.getText(); 
 
        int flag = 0; 
        String extn = ""; 
        for (int i = 0; i<fileName.length(); i++) { 
            if (fileName.charAt(i) == '.' || flag == 1) { 
                flag = 1; 
                extn += fileName.charAt(i); 
            } 
        } 
 
        if (extn.equals(".jpg") || extn.equals(".png")) { 
            try (FileInputStream fin = new FileInputStream(fileName)) { 
dout.writeUTF(fileName); 
System.out.println("Sending image..."); 
byte[] readData = new byte[1024]; 
                int i; 
                while ((i = fin.read(readData)) != -1) { 
dout.write(readData, 0, i); 
                } 
System.out.println("Image sent"); 
ta.append("\nImage Has Been Sent"); 
            } catch (IOException ex) { 
System.out.println("Image ::" + ex); 
            } 
        } else { 
            try (BufferedReaderbcr = new BufferedReader(new InputStreamReader(new 
FileInputStream(fileName)))) { 
dout.writeUTF(fileName); 
System.out.println("Sending File " + fileName); 
                String s1; 
ta.append("\n"); 
                while ((s1 = bcr.readLine()) != null) { 
System.out.println("" + s1); 
ta.append(s1 + "\n"); 
dout.writeUTF(s1); 
dout.flush(); 
Thread.currentThread().sleep(500);
                } 
            } catch (Exception e) {
 System.out.println("Enter Valid File Name");
            } 
        } 
    } 
 
    public static void main(String[] ar) {
        new Client(); 
    } 
}