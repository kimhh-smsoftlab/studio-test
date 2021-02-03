"use strict";

var FastDataView;
(function (exports) {

    var cacheBuffer = new ArrayBuffer(8);
    var uint8Array = new Uint8Array(cacheBuffer);
    var int8Array = new Int8Array(cacheBuffer);
    var uint16Array = new Uint16Array(cacheBuffer);
    var int16Array = new Int16Array(cacheBuffer);
    var uint32Array = new Uint32Array(cacheBuffer);
    var int32Array = new Int32Array(cacheBuffer);
    var float32Array = new Float32Array(cacheBuffer);
    var float64Array = new Float64Array(cacheBuffer);

    FastDataView = function (buffer, byteOffset, byteLength) {
        this.initCacheArray();
        if (buffer) {
            this.setBuffer(buffer, byteOffset, byteLength);
            // 맨처음할당된 사이즈 저장
            this.maxbyteLength = this.byteLength;
        } else {
            this.buffer = null;
            this.byteOffset = 0;
            this.byteLength = 0;
            this.byteArray = null;
            this.cursor = 0;
            this.maxbyteLength = 0;
        }
    };

    FastDataView.version = '0.3.3';

    ///////////////////////////////////
    //
    // Extra Methods
    //
    ///////////////////////////////////
    FastDataView.prototype.clear = function () {
        this.byteOffset = 0;
        this.byteLength = 0;
        this.cursor = 0;
    }

    FastDataView.prototype.initCacheArray = function () {
        this.uint8Array = uint8Array;
        this.int8Array = int8Array;
        // this.uint16Array = uint16Array;
        this.int16Array = int16Array;
        // this.uint32Array = uint32Array;
        this.int32Array = int32Array;
        this.float32Array = float32Array;
        this.float64Array = float64Array;
        this.maxbyteLength = 0;
    };

    FastDataView.prototype.transfer = function (source) {
        if (!(source instanceof Uint8Array))
            throw new TypeError('Source must be an instance of ArrayBuffer');

        this.clear();
        // 신규가 큰경우 재 할당을 한다.
        if (this.maxbyteLength < source.byteLength) {
            this.byteArray = null;
            this.byteArray = new Uint8Array(source, 0, source.byteLength);
        }
        else {
            this.byteArray.set(source, 0);
        }

        // 가장큰것
        this.maxbyteLength = Math.max(this.maxbyteLength, source.byteLength);
        this.buffer = this.byteArray.buffer;
        this.byteLength = source.byteLength;
    }

    FastDataView.prototype.setBuffer = function (buffer, byteOffset, byteLength) {
        // If buffer is an instance of Node Buffer , byteArray = buffer;
        var isByteArray = (buffer instanceof Uint8Array) || buffer.buffer;

        this.byteArray = isByteArray ? buffer : new Uint8Array(buffer);
        this.buffer = this.byteArray.buffer;

        this.setRange(byteOffset, byteLength);
    };

    FastDataView.prototype.setRange = function (byteOffset, byteLength) {
        var bufferSize = this.buffer.byteLength;
        this.byteOffset = Math.min(bufferSize, byteOffset || 0) | 0;

        var maxLength = bufferSize - this.byteOffset;
        this.byteLength = Math.min(maxLength, byteLength || maxLength) | 0;

        this.byteEnd = this.byteOffset + this.byteLength;
        this.cursor = 0;
    };

    FastDataView.prototype.subarray = function (begin, end, bRange) {
        // 시작,끝 지정
        if (bRange) {
            return this.byteArray.subarray(begin, end);
        }

        if (!end) {
            return this.byteArray.subarray(begin + this.byteOffset, this.byteEnd);
        }
        return this.byteArray.subarray(begin + this.byteOffset, Math.min(this.byteEnd, end + this.byteOffset));
    };

    FastDataView.prototype.getRest = function () {
        return this.byteArray.subarray(this.cursor + this.byteOffset, this.byteEnd);
    };

    FastDataView.prototype.skip = function (count) {
        this.cursor = Math.min(this.byteEnd, this.cursor + count);
    };

    ///////////////////////////////////
    //
    // Uint8
    //
    ///////////////////////////////////

    FastDataView.prototype.setUint8 = function (offset, value) {
        this.byteArray[offset + this.byteOffset] = value;
    };

    FastDataView.prototype.getUint8 = function (offset) {
        return this.byteArray[offset + this.byteOffset];
    };

    FastDataView.prototype.pushUint8 = function (value) {
        this.byteArray[this.byteOffset + this.cursor++] = value;
    };

    FastDataView.prototype.nextUint8 = function () {
        return this.byteArray[this.byteOffset + this.cursor++];
    };

    ///////////////////////////////////
    //
    // Int8
    //
    ///////////////////////////////////

    FastDataView.prototype.setInt8 = function (offset, value) {
        this.byteArray[offset + this.byteOffset] = value;
    };

    FastDataView.prototype.getInt8 = function (offset) {
        // Use TypedArray
        this.uint8Array[0] = this.byteArray[offset + this.byteOffset];
        return this.int8Array[0];
    };

    FastDataView.prototype.pushInt8 = function (value) {
        this.byteArray[this.byteOffset + this.cursor++] = value;
    };

    FastDataView.prototype.nextInt8 = function () {
        // Use TypedArray
        this.uint8Array[0] = this.byteArray[this.byteOffset + this.cursor++];
        return this.int8Array[0];
    };

    ///////////////////////////////////
    //
    // Uint16
    //
    ///////////////////////////////////

    FastDataView.prototype.setUint16 = function (offset, value, littleEndian) {
        offset += this.byteOffset;
        if (littleEndian) {
            this.byteArray[offset + 0] = value;
            this.byteArray[offset + 1] = value >>> 8;
        } else {
            this.byteArray[offset + 0] = value >>> 8;
            this.byteArray[offset + 1] = value;
        }
    };

    FastDataView.prototype.getUint16 = function (offset, littleEndian) {
        offset += this.byteOffset;
        var a, b;
        if (littleEndian) {
            a = this.byteArray[offset + 0];
            b = this.byteArray[offset + 1];
        } else {
            a = this.byteArray[offset + 1];
            b = this.byteArray[offset + 0];
        }
        return (b << 8) | a;
    };

    FastDataView.prototype.pushUint16 = function (value, littleEndian) {
        var offset = this.byteOffset + this.cursor;
        if (littleEndian) {
            this.byteArray[offset + 0] = value;
            this.byteArray[offset + 1] = value >>> 8;
        } else {
            this.byteArray[offset + 0] = value >>> 8;
            this.byteArray[offset + 1] = value;
        }
        this.cursor += 2;
    };

    FastDataView.prototype.nextUint16 = function (littleEndian) {
        var offset = this.byteOffset + this.cursor;
        var a, b;
        if (littleEndian) {
            a = this.byteArray[offset + 0];
            b = this.byteArray[offset + 1];
        } else {
            a = this.byteArray[offset + 1];
            b = this.byteArray[offset + 0];
        }
        this.cursor += 2;
        return (b << 8) | a;
    };

    ///////////////////////////////////
    //
    // Int16
    //
    ///////////////////////////////////

    FastDataView.prototype.setInt16 = function (offset, value, littleEndian) {
        offset += this.byteOffset;
        if (littleEndian) {
            this.byteArray[offset + 0] = value;
            this.byteArray[offset + 1] = value >>> 8;
        } else {
            this.byteArray[offset + 0] = value >>> 8;
            this.byteArray[offset + 1] = value;
        }
    };

    FastDataView.prototype.getInt16 = function (offset, littleEndian) {
        // Use TypedArray
        offset += this.byteOffset;
        if (littleEndian) {
            this.uint8Array[0] = this.byteArray[offset + 0];
            this.uint8Array[1] = this.byteArray[offset + 1];
        } else {
            this.uint8Array[0] = this.byteArray[offset + 1];
            this.uint8Array[1] = this.byteArray[offset + 0];
        }
        return this.int16Array[0];
    };

    FastDataView.prototype.pushInt16 = function (value, littleEndian) {
        var offset = this.byteOffset + this.cursor;
        if (littleEndian) {
            this.byteArray[offset + 0] = value;
            this.byteArray[offset + 1] = value >>> 8;
        } else {
            this.byteArray[offset + 0] = value >>> 8;
            this.byteArray[offset + 1] = value;
        }
        this.cursor += 2;
    };

    FastDataView.prototype.nextInt16 = function (littleEndian) {
        // Use TypedArray
        var offset = this.byteOffset + this.cursor;
        if (littleEndian) {
            this.uint8Array[0] = this.byteArray[offset + 0];
            this.uint8Array[1] = this.byteArray[offset + 1];
        } else {
            this.uint8Array[0] = this.byteArray[offset + 1];
            this.uint8Array[1] = this.byteArray[offset + 0];
        }
        this.cursor += 2;
        return this.int16Array[0];
    };

    ///////////////////////////////////
    //
    // Uint32
    //
    ///////////////////////////////////

    FastDataView.prototype.setUint32 = function (offset, value, littleEndian) {
        offset += this.byteOffset;
        if (littleEndian) {
            this.byteArray[offset + 0] = value;
            this.byteArray[offset + 1] = value >>> 8;
            this.byteArray[offset + 2] = value >>> 16;
            this.byteArray[offset + 3] = value >>> 24;
        } else {
            this.byteArray[offset + 0] = value >>> 24;
            this.byteArray[offset + 1] = value >>> 16;
            this.byteArray[offset + 2] = value >>> 8;
            this.byteArray[offset + 3] = value;
        }
    };

    FastDataView.prototype.getUint32 = function (offset, littleEndian) {
        offset += this.byteOffset;
        var a, b, c, d;
        if (littleEndian) {
            a = this.byteArray[offset + 0];
            b = this.byteArray[offset + 1];
            c = this.byteArray[offset + 2];
            d = this.byteArray[offset + 3];
        } else {
            a = this.byteArray[offset + 3];
            b = this.byteArray[offset + 2];
            c = this.byteArray[offset + 1];
            d = this.byteArray[offset + 0];
        }
        return ((d << 24) >>> 0) + ((c << 16) | (b << 8) | a);
    };

    FastDataView.prototype.pushUint32 = function (value, littleEndian) {
        var offset = this.byteOffset + this.cursor;
        if (littleEndian) {
            this.byteArray[offset + 0] = value;
            this.byteArray[offset + 1] = value >>> 8;
            this.byteArray[offset + 2] = value >>> 16;
            this.byteArray[offset + 3] = value >>> 24;
        } else {
            this.byteArray[offset + 0] = value >>> 24;
            this.byteArray[offset + 1] = value >>> 16;
            this.byteArray[offset + 2] = value >>> 8;
            this.byteArray[offset + 3] = value;
        }
        this.cursor += 4;
    };

    FastDataView.prototype.nextUint32 = function (littleEndian) {
        var offset = this.byteOffset + this.cursor;
        var a, b, c, d;
        if (littleEndian) {
            a = this.byteArray[offset + 0];
            b = this.byteArray[offset + 1];
            c = this.byteArray[offset + 2];
            d = this.byteArray[offset + 3];
        } else {
            a = this.byteArray[offset + 3];
            b = this.byteArray[offset + 2];
            c = this.byteArray[offset + 1];
            d = this.byteArray[offset + 0];
        }
        this.cursor += 4;
        return ((d << 24) >>> 0) + ((c << 16) | (b << 8) | a);
    };

    ///////////////////////////////////
    //
    // Int32
    //
    ///////////////////////////////////

    FastDataView.prototype.setInt32 = function (offset, value, littleEndian) {
        offset += this.byteOffset;
        if (littleEndian) {
            this.byteArray[offset + 0] = value;
            this.byteArray[offset + 1] = value >>> 8;
            this.byteArray[offset + 2] = value >>> 16;
            this.byteArray[offset + 3] = value >>> 24;
        } else {
            this.byteArray[offset + 0] = value >>> 24;
            this.byteArray[offset + 1] = value >>> 16;
            this.byteArray[offset + 2] = value >>> 8;
            this.byteArray[offset + 3] = value;
        }
    };

    FastDataView.prototype.getInt32 = function (offset, littleEndian) {
        // Use TypedArray
        offset += this.byteOffset;
        if (littleEndian) {
            this.uint8Array[0] = this.byteArray[offset + 0];
            this.uint8Array[1] = this.byteArray[offset + 1];
            this.uint8Array[2] = this.byteArray[offset + 2];
            this.uint8Array[3] = this.byteArray[offset + 3];
        } else {
            this.uint8Array[0] = this.byteArray[offset + 3];
            this.uint8Array[1] = this.byteArray[offset + 2];
            this.uint8Array[2] = this.byteArray[offset + 1];
            this.uint8Array[3] = this.byteArray[offset + 0];
        }
        return this.int32Array[0];
    };

    FastDataView.prototype.pushInt32 = function (value, littleEndian) {
        var offset = this.byteOffset + this.cursor;
        if (littleEndian) {
            this.byteArray[offset + 0] = value;
            this.byteArray[offset + 1] = value >>> 8;
            this.byteArray[offset + 2] = value >>> 16;
            this.byteArray[offset + 3] = value >>> 24;
        } else {
            this.byteArray[offset + 0] = value >>> 24;
            this.byteArray[offset + 1] = value >>> 16;
            this.byteArray[offset + 2] = value >>> 8;
            this.byteArray[offset + 3] = value;
        }
        this.cursor += 4;
    };

    FastDataView.prototype.nextInt32 = function (littleEndian) {
        // Use TypedArray
        var offset = this.byteOffset + this.cursor;
        if (littleEndian) {
            this.uint8Array[0] = this.byteArray[offset + 0];
            this.uint8Array[1] = this.byteArray[offset + 1];
            this.uint8Array[2] = this.byteArray[offset + 2];
            this.uint8Array[3] = this.byteArray[offset + 3];
        } else {
            this.uint8Array[0] = this.byteArray[offset + 3];
            this.uint8Array[1] = this.byteArray[offset + 2];
            this.uint8Array[2] = this.byteArray[offset + 1];
            this.uint8Array[3] = this.byteArray[offset + 0];
        }
        this.cursor += 4;
        return this.int32Array[0];
    };

    ///////////////////////////////////
    //
    // Float32
    //
    ///////////////////////////////////

    FastDataView.prototype.setFloat32 = function (offset, value, littleEndian) {
        offset += this.byteOffset;
        this.float32Array[0] = value;
        if (littleEndian) {
            this.byteArray[offset + 0] = this.uint8Array[0];
            this.byteArray[offset + 1] = this.uint8Array[1];
            this.byteArray[offset + 2] = this.uint8Array[2];
            this.byteArray[offset + 3] = this.uint8Array[3];
        } else {
            this.byteArray[offset + 0] = this.uint8Array[3];
            this.byteArray[offset + 1] = this.uint8Array[2];
            this.byteArray[offset + 2] = this.uint8Array[1];
            this.byteArray[offset + 3] = this.uint8Array[0];
        }
    };

    FastDataView.prototype.getFloat32 = function (offset, littleEndian) {
        // Use TypedArray
        offset += this.byteOffset;
        if (littleEndian) {
            this.uint8Array[0] = this.byteArray[offset + 0];
            this.uint8Array[1] = this.byteArray[offset + 1];
            this.uint8Array[2] = this.byteArray[offset + 2];
            this.uint8Array[3] = this.byteArray[offset + 3];
        } else {
            this.uint8Array[0] = this.byteArray[offset + 3];
            this.uint8Array[1] = this.byteArray[offset + 2];
            this.uint8Array[2] = this.byteArray[offset + 1];
            this.uint8Array[3] = this.byteArray[offset + 0];
        }
        return this.float32Array[0];
    };

    FastDataView.prototype.pushFloat32 = function (value, littleEndian) {
        var offset = this.byteOffset + this.cursor;
        this.float32Array[0] = value;
        if (littleEndian) {
            this.byteArray[offset + 0] = this.uint8Array[0];
            this.byteArray[offset + 1] = this.uint8Array[1];
            this.byteArray[offset + 2] = this.uint8Array[2];
            this.byteArray[offset + 3] = this.uint8Array[3];
        } else {
            this.byteArray[offset + 0] = this.uint8Array[3];
            this.byteArray[offset + 1] = this.uint8Array[2];
            this.byteArray[offset + 2] = this.uint8Array[1];
            this.byteArray[offset + 3] = this.uint8Array[0];
        }
        this.cursor += 4;
    };

    FastDataView.prototype.nextFloat32 = function (littleEndian) {
        // Use TypedArray
        var offset = this.byteOffset + this.cursor;
        if (littleEndian) {
            this.uint8Array[0] = this.byteArray[offset + 0];
            this.uint8Array[1] = this.byteArray[offset + 1];
            this.uint8Array[2] = this.byteArray[offset + 2];
            this.uint8Array[3] = this.byteArray[offset + 3];
        } else {
            this.uint8Array[0] = this.byteArray[offset + 3];
            this.uint8Array[1] = this.byteArray[offset + 2];
            this.uint8Array[2] = this.byteArray[offset + 1];
            this.uint8Array[3] = this.byteArray[offset + 0];
        }
        this.cursor += 4;
        return this.float32Array[0];
    };

    ///////////////////////////////////
    //
    // Float64
    //
    ///////////////////////////////////

    FastDataView.prototype.setFloat64 = function (offset, value, littleEndian) {
        offset += this.byteOffset;
        this.float64Array[0] = value;
        if (littleEndian) {
            this.byteArray[offset + 0] = this.uint8Array[0];
            this.byteArray[offset + 1] = this.uint8Array[1];
            this.byteArray[offset + 2] = this.uint8Array[2];
            this.byteArray[offset + 3] = this.uint8Array[3];
            this.byteArray[offset + 4] = this.uint8Array[4];
            this.byteArray[offset + 5] = this.uint8Array[5];
            this.byteArray[offset + 6] = this.uint8Array[6];
            this.byteArray[offset + 7] = this.uint8Array[7];
        } else {
            this.byteArray[offset + 0] = this.uint8Array[7];
            this.byteArray[offset + 1] = this.uint8Array[6];
            this.byteArray[offset + 2] = this.uint8Array[5];
            this.byteArray[offset + 3] = this.uint8Array[4];
            this.byteArray[offset + 4] = this.uint8Array[3];
            this.byteArray[offset + 5] = this.uint8Array[2];
            this.byteArray[offset + 6] = this.uint8Array[1];
            this.byteArray[offset + 7] = this.uint8Array[0];
        }
    };

    FastDataView.prototype.getFloat64 = function (offset, littleEndian) {
        offset += this.byteOffset;
        // Use TypedArray
        if (littleEndian) {
            this.uint8Array[0] = this.byteArray[offset + 0];
            this.uint8Array[1] = this.byteArray[offset + 1];
            this.uint8Array[2] = this.byteArray[offset + 2];
            this.uint8Array[3] = this.byteArray[offset + 3];
            this.uint8Array[4] = this.byteArray[offset + 4];
            this.uint8Array[5] = this.byteArray[offset + 5];
            this.uint8Array[6] = this.byteArray[offset + 6];
            this.uint8Array[7] = this.byteArray[offset + 7];
        } else {
            this.uint8Array[0] = this.byteArray[offset + 7];
            this.uint8Array[1] = this.byteArray[offset + 6];
            this.uint8Array[2] = this.byteArray[offset + 5];
            this.uint8Array[3] = this.byteArray[offset + 4];
            this.uint8Array[4] = this.byteArray[offset + 3];
            this.uint8Array[5] = this.byteArray[offset + 2];
            this.uint8Array[6] = this.byteArray[offset + 1];
            this.uint8Array[7] = this.byteArray[offset + 0];
        }
        return this.float64Array[0];
    };

    FastDataView.prototype.pushFloat64 = function (value, littleEndian) {
        var offset = this.byteOffset + this.cursor;
        this.float64Array[0] = value;
        if (littleEndian) {
            this.byteArray[offset + 0] = this.uint8Array[0];
            this.byteArray[offset + 1] = this.uint8Array[1];
            this.byteArray[offset + 2] = this.uint8Array[2];
            this.byteArray[offset + 3] = this.uint8Array[3];
            this.byteArray[offset + 4] = this.uint8Array[4];
            this.byteArray[offset + 5] = this.uint8Array[5];
            this.byteArray[offset + 6] = this.uint8Array[6];
            this.byteArray[offset + 7] = this.uint8Array[7];
        } else {
            this.byteArray[offset + 0] = this.uint8Array[7];
            this.byteArray[offset + 1] = this.uint8Array[6];
            this.byteArray[offset + 2] = this.uint8Array[5];
            this.byteArray[offset + 3] = this.uint8Array[4];
            this.byteArray[offset + 4] = this.uint8Array[3];
            this.byteArray[offset + 5] = this.uint8Array[2];
            this.byteArray[offset + 6] = this.uint8Array[1];
            this.byteArray[offset + 7] = this.uint8Array[0];
        }
        this.cursor += 8;
    };

    FastDataView.prototype.nextFloat64 = function (littleEndian) {
        // Use TypedArray
        var offset = this.byteOffset + this.cursor;
        if (littleEndian) {
            this.uint8Array[0] = this.byteArray[offset + 0];
            this.uint8Array[1] = this.byteArray[offset + 1];
            this.uint8Array[2] = this.byteArray[offset + 2];
            this.uint8Array[3] = this.byteArray[offset + 3];
            this.uint8Array[4] = this.byteArray[offset + 4];
            this.uint8Array[5] = this.byteArray[offset + 5];
            this.uint8Array[6] = this.byteArray[offset + 6];
            this.uint8Array[7] = this.byteArray[offset + 7];
        } else {
            this.uint8Array[0] = this.byteArray[offset + 7];
            this.uint8Array[1] = this.byteArray[offset + 6];
            this.uint8Array[2] = this.byteArray[offset + 5];
            this.uint8Array[3] = this.byteArray[offset + 4];
            this.uint8Array[4] = this.byteArray[offset + 3];
            this.uint8Array[5] = this.byteArray[offset + 2];
            this.uint8Array[6] = this.byteArray[offset + 1];
            this.uint8Array[7] = this.byteArray[offset + 0];
        }
        this.cursor += 8;
        return this.float64Array[0];
    };

    FastDataView.prototype.getString = function (begin, end) {
        var str = "";
        str = String.fromCharCode.apply(null, this.subarray(begin, end, true));
        return str;
    }

    FastDataView.prototype.atoi = function (begin, end) {
        var positive = 1, val = 0, c;
        if (this.byteArray[begin] == 45) {  // '-' 인경우
            positive = -1; begin++;
        }
        while (begin < end) {
            c = this.byteArray[begin++];
            if (c >= 48 && c <= 57) {
                val = (val * 10) + (c - 48);
            }
        }
        return val * positive;
    }

    FastDataView.prototype.trim = function (begin, end) {
        var i = end;
        //var ar = this.byteArray.subarray(begin, end);
        //var str = String.fromCharCode.apply(null, this.subarray(begin, end, true));

        // 맨 뒤에서 스페이스 제거
        if (this.byteArray[end - 1] == 32 || this.byteArray[end - 1] == 0) {
            while (i >= begin) {
                if (this.byteArray[--i] > 33) {
                    if (i + 1 == begin) return [];
                    break;
                }
            }
            end = i + 1;
        }
        // 맨 앞에서 스페이스 제거
        if (begin < end && this.byteArray[begin] == 32) {
            while (begin < end) {
                if (this.byteArray[++begin] > 33) {
                    break;
                }
            }
        }
        return this.byteArray.subarray(begin, end);
    }

    FastDataView.prototype.getUtf8String = function (begin, end) {
        var ar = this.trim(begin, end), str = "";
        // Utf8ArrayToStr
        str = hi5.utf2Str(ar);
        return str;
    }

    FastDataView.prototype.getStringNum = function (begin, end) {
        var ar = this.trim(begin, end), str = "";
        str = String.fromCharCode.apply(null, ar);

        return str;
    }

    FastDataView.prototype.A2UBin = function (arBuf, item, endian) {
        var dataLen = item.datalen, dataType = item.datatype == undefined ? FT_STRING : item.datatype, byteOffset = item.offsetlen, encode = item.encoding;
        var endianness = endian === undefined && false || endian; // true is Little-endian
        var sign = 0;
        if (item.attr != undefined && item.attr == 1) {
            sign = 1; dataLen--;
        }

        //if (  (byteOffset + dataLen) > this.byteLength  ) {
        //    throw new TypeError('ArrayBuffer overflow');
        //}

        //Indicates whether the 32-bit float is stored in little- or big-endian format. If false or undefined, a big-endian value is read.
        switch (dataType) {                  // unsigned char(8bit)
            case FT_BYTE:
                //return String.fromCharCode(this.getUint8(byteOffset));
                return this.getUint8(byteOffset);
                break;                      // unsigned char(8bit)
            case FT_SHORT:                  // int16
                return this.getInt16(byteOffset, endianness);
                break;
            case FT_USHORT:                 // unsigned int16 
                return this.getUint16(byteOffset, endianness);
                break;
            case FT_FILLER:	                // filler
                return "";
            case FT_LONG:                   // int32
            case FT_DAY:	                // 일자형 
            case FT_TIME:                   // 시간형 
                return this.getInt32(byteOffset, endianness);
                break;
            case FT_ULONG:                  // unsigned int32 
                return this.getUint32(byteOffset, endianness);
                break;
            case FT_FLOAT:                  // float  (4 bytes)
                return this.getFloat32(byteOffset, endianness);
                break;
            case FT_DOUBLE:                 // double (8 bytes)
            case FT_LONGLONG:               // int64  (8 bytes)  
                return this.getFloat64(byteOffset, endianness);
                break;
            case FT_STRINGNUM:  		   // 숫자형 문자열
                if (item.atoi) return this.atoi(byteOffset, byteOffset + dataLen);
                return this.getStringNum(byteOffset, byteOffset + dataLen);
                break;
            case FT_STRING:                // 일반 텍스트(좌측정렬)
                // --> [Edit] 수정자:kim changa 일시:2019/02/27
                // 수정내용>  UTF8 변환작업
                return this.getUtf8String(byteOffset, byteOffset + dataLen);  // 서버에서 UTF8로 encoding 된경우
                //return hi5.A2U(this.subarray(byteOffset, byteOffset + dataLen, true), encode).Ntrim() // 서버에서 MultiByte to UTF8로 encoding 경우;
                // <-- [Edit] kim changa 2019/02/27
                break;
            default: break;
        }
        return "";
    }

    if (exports) {
        exports.FastDataView = FastDataView;
    }

    if (typeof module !== "undefined") {
        module.exports = FastDataView;
    }

})(typeof window !== "undefined" ? window : null);
