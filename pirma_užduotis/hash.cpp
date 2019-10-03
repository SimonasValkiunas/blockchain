#include <cstdlib>
#include <iostream>
#include <string>
#include <sstream>
#include <vector> 


using std::string, std::cout,std::cin,std::endl,std::ostringstream,std::hex,std::uppercase,std::stringstream,std::vector;

//returns 64 length alphanumeric string
string hashFunction(string input){

    // converts a string to numeric values
    vector <string> subNumbers;
    string seedString;

    for(int i = 0; i< input.length(); i++){
        //numeric value of character
        int temp =  static_cast<int>(input[i]);
        //numric value converted to string
        string tempString = std::to_string(temp);
        //Adds 0's for uniques
        if(i != 0 && tempString.length() < 3){
            string sub = "";
            for (int j = 0; j < 3-tempString.length(); j++){
                sub += "0"; 
            }
            tempString = sub + tempString;
        }
        seedString += tempString;
        //Every 18 digits create new number
        if(i % 6 == 0){
            subNumbers.push_back(seedString);
            seedString = "";
        }
    }

    vector<int> seedVector;
    //convert a string of int to int
    for(int i = 0; i < subNumbers.size(); i++){
        stringstream ss(subNumbers.at(i)); 
        long long int seed;
        ss >> seed;
        seedVector.push_back(seed);
        cout << subNumbers.at(i) << endl;
        cout << seedVector.at(i) << endl;
    }

    string optionArray = "12345678890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
    string output = "";


    srand(seedVector[0]);
    for(int i = 0; i < 200; i++){
        int random = rand() % optionArray.length();
        int randomSeed = rand() % seedVector.size();
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
    std::vector <string> colour; 
    string input = ""; 
    cout << "Enter a string to hash " <<endl;
    cin >> input;
    cout << hashFunction(input) << endl;
    return 0;
}







