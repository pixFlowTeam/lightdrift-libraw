#include "libraw_wrapper.h"
#include <iostream>
#include <sstream>

Napi::FunctionReference LibRawWrapper::constructor;

Napi::Object LibRawWrapper::Init(Napi::Env env, Napi::Object exports) {
    Napi::HandleScope scope(env);

    Napi::Function func = DefineClass(env, "LibRawWrapper", {
        InstanceMethod("loadFile", &LibRawWrapper::LoadFile),
        InstanceMethod("getMetadata", &LibRawWrapper::GetMetadata),
        InstanceMethod("getImageSize", &LibRawWrapper::GetImageSize),
        InstanceMethod("close", &LibRawWrapper::Close)
    });

    constructor = Napi::Persistent(func);
    constructor.SuppressDestruct();

    exports.Set("LibRawWrapper", func);
    return exports;
}

LibRawWrapper::LibRawWrapper(const Napi::CallbackInfo& info) 
    : Napi::ObjectWrap<LibRawWrapper>(info), isLoaded(false) {
    Napi::Env env = info.Env();
    Napi::HandleScope scope(env);

    try {
        processor = std::make_unique<LibRaw>();
    } catch (const std::exception& e) {
        Napi::TypeError::New(env, "Failed to initialize LibRaw").ThrowAsJavaScriptException();
    }
}

LibRawWrapper::~LibRawWrapper() {
    if (processor && isLoaded) {
        processor->recycle();
    }
}

Napi::Value LibRawWrapper::LoadFile(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 1 || !info[0].IsString()) {
        Napi::TypeError::New(env, "Expected string filename").ThrowAsJavaScriptException();
        return env.Null();
    }

    std::string filename = info[0].As<Napi::String>().Utf8Value();

    try {
        int ret = processor->open_file(filename.c_str());
        if (ret != LIBRAW_SUCCESS) {
            std::string error = "Failed to open file: ";
            error += libraw_strerror(ret);
            Napi::Error::New(env, error).ThrowAsJavaScriptException();
            return env.Null();
        }

        ret = processor->unpack();
        if (ret != LIBRAW_SUCCESS) {
            std::string error = "Failed to unpack file: ";
            error += libraw_strerror(ret);
            Napi::Error::New(env, error).ThrowAsJavaScriptException();
            return env.Null();
        }

        isLoaded = true;
        return Napi::Boolean::New(env, true);
    } catch (const std::exception& e) {
        Napi::Error::New(env, e.what()).ThrowAsJavaScriptException();
        return env.Null();
    }
}

Napi::Value LibRawWrapper::GetMetadata(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (!isLoaded) {
        Napi::Error::New(env, "No file loaded").ThrowAsJavaScriptException();
        return env.Null();
    }

    Napi::Object metadata = Napi::Object::New(env);

    try {
        // Camera info
        if (processor->imgdata.idata.make[0]) {
            metadata.Set("make", Napi::String::New(env, processor->imgdata.idata.make));
        }
        if (processor->imgdata.idata.model[0]) {
            metadata.Set("model", Napi::String::New(env, processor->imgdata.idata.model));
        }

        // Image dimensions
        metadata.Set("width", Napi::Number::New(env, processor->imgdata.sizes.width));
        metadata.Set("height", Napi::Number::New(env, processor->imgdata.sizes.height));
        metadata.Set("rawWidth", Napi::Number::New(env, processor->imgdata.sizes.raw_width));
        metadata.Set("rawHeight", Napi::Number::New(env, processor->imgdata.sizes.raw_height));

        // Color info
        metadata.Set("colors", Napi::Number::New(env, processor->imgdata.idata.colors));
        metadata.Set("filters", Napi::Number::New(env, processor->imgdata.idata.filters));

        // ISO and exposure
        if (processor->imgdata.other.iso_speed > 0) {
            metadata.Set("iso", Napi::Number::New(env, processor->imgdata.other.iso_speed));
        }
        if (processor->imgdata.other.shutter > 0) {
            metadata.Set("shutterSpeed", Napi::Number::New(env, processor->imgdata.other.shutter));
        }
        if (processor->imgdata.other.aperture > 0) {
            metadata.Set("aperture", Napi::Number::New(env, processor->imgdata.other.aperture));
        }
        if (processor->imgdata.other.focal_len > 0) {
            metadata.Set("focalLength", Napi::Number::New(env, processor->imgdata.other.focal_len));
        }

        // Timestamp
        if (processor->imgdata.other.timestamp > 0) {
            metadata.Set("timestamp", Napi::Number::New(env, processor->imgdata.other.timestamp));
        }

        return metadata;
    } catch (const std::exception& e) {
        Napi::Error::New(env, e.what()).ThrowAsJavaScriptException();
        return env.Null();
    }
}

Napi::Value LibRawWrapper::GetImageSize(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (!isLoaded) {
        Napi::Error::New(env, "No file loaded").ThrowAsJavaScriptException();
        return env.Null();
    }

    Napi::Object size = Napi::Object::New(env);
    size.Set("width", Napi::Number::New(env, processor->imgdata.sizes.width));
    size.Set("height", Napi::Number::New(env, processor->imgdata.sizes.height));
    size.Set("rawWidth", Napi::Number::New(env, processor->imgdata.sizes.raw_width));
    size.Set("rawHeight", Napi::Number::New(env, processor->imgdata.sizes.raw_height));

    return size;
}

Napi::Value LibRawWrapper::Close(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (processor && isLoaded) {
        processor->recycle();
        isLoaded = false;
    }

    return Napi::Boolean::New(env, true);
}
