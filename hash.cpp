#include <cstdlib>
#include <iostream>
#include <string>
#include <sstream>


using std::string, std::cout,std::cin,std::endl,std::ostringstream,std::hex,std::uppercase,std::stringstream;

//returns 64 length alphanumeric string
string hashFunction(string input){

    // int seed[] = {};
    string seedString;
    for(int i =0; i< input.length(); i++){
        int temp =  static_cast<int>(input[i]);
        string tempString = std::to_string(temp);
        if(i != 0 && tempString.length() < 3){
            string sub = "";
            for (int j = 0; j < 3-tempString.length(); j++){
                sub += "0"; 
            }
            tempString = sub + tempString;
        }
        seedString += tempString;
    }
    stringstream ss(seedString); 
    long long int seed = 0;

    ss >> seed;
    cout << seed << endl;

    string optionArray = "12345678890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
    string output = "";

    srand(seed);
    for(int i = 0; i < 64; i++){
        int random = rand() % 64;
        output += optionArray[random];
    }
    return output;
}

bool checkPrime(int number){
    for (int i =2; i <= 128; i++){
        if(number % i == 0){
            return true;
        }
    }
    return false;
}




int main()
{
    string input = ""; 
    cout << "Enter a string to hash " <<endl;
    cin >> input;

    cout << hashFunction(input) << endl;
    // hashFunction(input);
    return 0;
}







