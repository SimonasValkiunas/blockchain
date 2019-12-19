#include <cstdlib>
#include <iostream>
#include <string>
#include <sstream>
#include <vector> 
#include <fstream>


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

void test1(){
    std::ofstream file ("test_files/test1.txt");
    string options = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890";
    srand(1);
    int random = rand() % options.length();
    string out = "";
    out += options[random];
    if(file.is_open()){
        file << out;
        file.close();
    }
    std::ofstream hash_file ("test_files/hash1.txt");
    if(hash_file.is_open()){
        hash_file << hashFunction(out,64);
        hash_file.close();
    }


    std::ofstream file2 ("test_files/test1_1.txt");
    srand(2);
    random = rand() % options.length();
    out = "";
    out += options[random];
    if(file2.is_open()){
        file2 << out;
        file2.close();
    }
    std::ofstream hash_file2 ("test_files/hash1_1.txt");
    if(hash_file2.is_open()){
        hash_file2 << hashFunction(out,64);
        hash_file2.close();
    }
}




void test2(int size){
    std::ofstream file ("test_files/test2.txt");
    string output = "";
    if(file.is_open()){
        srand(1);
        string options = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890";
        for(int i = 0; i < size; i++){
            int random = rand() % options.length();
            output += options[random];
        }
        file << output;
        file.close();
    }
    std::ofstream hash_file ("test_files/hash2.txt");
    if(hash_file.is_open()){
        hash_file << hashFunction(output,64);
        hash_file.close();
    }


    std::ofstream file2 ("test_files/test2_1.txt");
    output = "";
    if(file2.is_open()){
        srand(2);
        string options = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890";
        for(int i = 0; i < size; i++){
            int random = rand() % options.length();
            output += options[random];
        }
        file2 << output;
        file2.close();
    }
    std::ofstream hash_file2 ("test_files/hash2_1.txt");
    if(hash_file2.is_open()){
        hash_file2 << hashFunction(output,64);
        hash_file2.close();
    }
}

void test4(int size){

    std::ofstream file ("test_files/test4.txt");
    if(file.is_open()){
        for(int j=0; j <100000; j++){
            string output = "";
            string output2 = "";
            string options = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890";
            for(int i = 0; i < size; i++){
                int random = rand() % options.length();
                output += options[random];
                output2 += options[random+1];
            }
            file << output << "," <<output2 << endl;
        }
        file.close();
    }

    int failed = 0;
    std::ifstream hash_file ("test_files/test4.txt");
    if(hash_file.is_open()){
        std::string line;
        while (getline(hash_file, line)) {
            std::string first,second;
            std::string delimiter = ",";
            first = line.substr(0, line.find(delimiter));
            second = line.substr(line.find(delimiter)+1, line.length());
            if(hashFunction(first,64) == hashFunction(second,64)) failed++;
        }
        hash_file.close();
    }

    cout << failed << endl;
}

void test5(int size){

    std::ofstream file ("test_files/test5.txt");
    if(file.is_open()){
        for(int j=0; j <100000; j++){
            string output = "";
            string output2 = "";
            string options = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890";
            for(int i = 0; i < size; i++){
                int random = rand() % options.length();
                if(i==0){
                    output += options[random];
                    output2 += options[random+1];
                }else {
                    output += options[random];
                    output2 += options[random];
                }
            }
            file << output << "," <<output2 << endl;
        }
        file.close();
    }

    int failed = 0;
    std::ifstream hash_file ("test_files/test5.txt");
    if(hash_file.is_open()){
        std::string line;
        while (getline(hash_file, line)) {
            std::string first,second;
            std::string delimiter = ",";
            first = line.substr(0, line.find(delimiter));
            second = line.substr(line.find(delimiter)+1, line.length());
            if(hashFunction(first,64) == hashFunction(second,64)) failed++;
        }
        hash_file.close();
    }

    cout << failed << endl;
}



int main()
{
    std::vector <string> colour; 
    string input = ""; 
    // cout << "Enter a string to hash " <<endl;
    // cin >> input;
    // cout << hashFunction(input,64) << endl;
    test5(5);
    return 0;
}







