#include <cstdlib>
#include <iostream>
#include <string>
#include <sstream>
#include <vector> 


using std::string, std::cout,std::cin,std::endl,std::ostringstream,std::hex,std::uppercase,std::stringstream,std::vector;

int * generateRow(int seed,int size, int upperbound){
    int output[size];
    int * pointer = output;
    srand(seed);
    for(int i = 0; i < size; i++){
        output[i] = rand() % upperbound;
    }
    return pointer;
}


string getUniqueNumber(string input){
    string output = "";
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
        output += tempString;
    }
    return output;
}

vector<unsigned long long int> divideIntoSubs(string seedString,int size){
    vector<unsigned long long int> output;
    if(seedString.length() <= (size/3) ){
        unsigned long long int seed;
        stringstream ss(seedString); 
        ss >> seed;
        output.push_back(seed);
        cout << "Not divided";
        return output;
    }else {
        string temp = "";
        int divider = seedString.length() / 16;
        int remainder = seedString.length() % 16;
        for(int i = 0; i < seedString.length(); i++){
            temp += seedString[i];
            if(i!=0 && i % size == 0){
                unsigned long long int seed;
                stringstream ss(temp); 
                ss >> seed;
                output.push_back(seed);
                temp = "";
            }
        }
        cout << "Divided"<<endl;
        return output;
    }
}





//returns 64 length alphanumeric string
string hashFunction(string input){

    string unique = getUniqueNumber(input);
    vector<unsigned long long int> subNumbers = divideIntoSubs(unique,16);

    for(vector<unsigned long long int>::iterator it = subNumbers.begin(); it != subNumbers.end(); ++it){
        cout << *it << endl;
        for(int i = 0; i < 30; i++){
            cout << *(generateRow(*it,30,64)+i) << " ";
        }
        cout << endl;
    }


    // // ----------------------------------

    // //Declaring seedVector and seed int
    // vector<int> seedVector;
    // long long int seed;

    // //Check if seed is long
    // if (subNumbers.size() > 1){
    //     //convert a string of int to int
    //     for(int i = 0; i < subNumbers.size(); i++){
    //         stringstream ss(subNumbers.at(i)); 
    //         ss >> seed;
    //         seedVector.push_back(seed);
    //         //use first string as seed
    //     }
    //     srand(seedVector[0]);
    //     cout << seedVector[0] << endl;
    // }else {
    //     //use whole string as seed
    //     stringstream ss(seedString); 
    //     ss >> seed;
    //     srand(seed);
    // }

    // // ------------------------------------

    // string optionArray = "12345678890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
    // string output = "";



    // for(int i = 0; i < 100; i++){
    //     int random = rand() % optionArray.length();
    //     output += optionArray[random];
    // }
    string output = "";
    return output;
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







