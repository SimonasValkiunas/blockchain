
import hashlib
from struct import pack, unpack, unpack_from
from binascii import unhexlify
from bitcoin.rpc import RawProxy
import datetime, calendar
import sys

p = RawProxy()
block_hash = sys.argv[1]
block =  p.getblock(block_hash)

header = (pack('<I', block['version']).encode('hex_codec') + block['previousblockhash'].decode('hex')[::-1].encode('hex_codec') + block['merkleroot'].decode('hex')[::-1].encode('hex_codec') + pack('<I', block['time']).encode('hex_codec') + pack('<I', int(block['bits'], 16)).encode('hex_codec')  + pack('<I', block['nonce']).encode('hex_codec')).decode('hex')
hash = hashlib.sha256(hashlib.sha256(header).digest()).digest()[::-1].encode('hex_codec')

if hash == block['hash']:
    print "Block has correct hash"
else:
    print "Blocks hash is incorrect"