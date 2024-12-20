	
int sound_sensor = A2; //assign to pin A2
int led = 13;
 
void setup() 
{
  Serial.begin(9600); //begin Serial Communication
  
}
 
void loop()
{
  int soundValue = 0; //create variable to store many different readings
  //for (int i = 0; i < 32; i++) //create a for loop to read 
  soundValue = analogRead(sound_sensor);   //read the sound sensor
  Serial.println(soundValue,HEX); //print the value of sound sensor

  delay(100); //a shorter delay between readings
}