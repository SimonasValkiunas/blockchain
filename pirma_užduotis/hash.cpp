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
        return output;
    }else {
        string temp = "";
        int divider = seedString.length() / 16;
        int remainder = seedString.length() % 16;

        if (remainder != 0) {
            divider++;
        }

        int countSegments = 0;
        unsigned long long int seed;
        for(int i = 0; i < seedString.length(); i++){
            temp += seedString[i];
            if(i!=0 && i % size == 0){
                stringstream ss(temp); 
                ss >> seed;
                output.push_back(seed);
                temp = "";
                countSegments++;
            }
            if(divider - countSegments == 1 && seedString.length() - i == 1){
                stringstream ss(temp); 
                ss >> seed;
                output.push_back(seed);
            }
        }
        return output;
    }
}

string generateString(int *arr,int size){
    string output = "";
    string options = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890";
    for(int i = 0; i < size; i++){
        srand(*(arr+i));
        int random = rand() % options.length();
        output += options[random];
    }
    return output;
}



//returns 64 length alphanumeric string
string hashFunction(string input,int size){

    string unique = getUniqueNumber(input);
    vector<unsigned long long int> subNumbers = divideIntoSubs(unique,16);
    int seedArray[size];
    for(int i =0; i < size; i++) seedArray[i] =0;
    for(int i = 0; i < size; i++){
        for(vector<unsigned long long int>::iterator it = subNumbers.begin(); it != subNumbers.end(); it++){
            seedArray[i] += *(generateRow(*it,size,64)+i);
        }
    }
    int * pointer = seedArray;

    string output = generateString(pointer, size);
    return output;
}

int main()
{
    std::vector <string> colour; 
    string input = ""; 
    cout << "Enter a string to hash " <<endl;
    cin >> input;
    cout << hashFunction(input,64) << endl;
    return 0;
}







