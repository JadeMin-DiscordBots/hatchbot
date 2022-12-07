export const toUnit8 = (value, format) => {
	if(value == null) return new Uint8Array();
	
	if(typeof value === 'string') {
		if(format === 'hex') {
			const matches = value.match(/.{1,2}/g);
			if(matches == null) {
				throw new Error("Value is not a valid hex string");
			}
			const hexVal = matches.map((byte) => parseInt(byte, 16));
			return new Uint8Array(hexVal);
		} else {
			return new TextEncoder().encode(value);
		}
	}
	try {
		if(Buffer.isBuffer(value)) {
			const arrayBuffer = value.buffer.slice(value.byteOffset, value.byteOffset + value.length);
			return new Uint8Array(value);
		}
	} catch(ex){
		// Runtime doesn't have Buffer
	}
	if(value instanceof ArrayBuffer) {
		return new Uint8Array(value);
	}
	if(value instanceof Uint8Array) {
		return value;
	}
	
	throw new Error('Unrecognized value type, must be one of: string, Buffer, ArrayBuffer, Uint8Array');
};
export const concatUint8Arrays = (arr1, arr2) => {
	const merged = new Uint8Array(arr1.length + arr2.length);
	merged.set(arr1);
	merged.set(arr2, arr1.length);
	return merged;
};