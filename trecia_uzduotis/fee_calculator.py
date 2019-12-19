import sys
from bitcoin.rpc import RawProxy

p = RawProxy()

txId = sys.argv[1]
tx = p.getrawtransaction(txId, 1)


#Calculate input value

input_value = 0
for vin in tx['vin']:
    input_tx = p.getrawtransaction(vin['txid'], 1)
    original_vout_index = vin['vout']
    for vout_index, vout in enumerate(input_tx['vout']):
        if(vout_index == original_vout_index):
            input_value = input_value + vout['value'] 
print 'Transactions input value: ', input_value

#Calculate output value

output_value = 0
for vout in tx['vout']:
    output_value = output_value + vout['value']

print 'Transactions output value: ', output_value

print 'Transactions fee: ', input_value - output_value