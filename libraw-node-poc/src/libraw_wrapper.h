#ifndef LIBRAW_WRAPPER_H
#define LIBRAW_WRAPPER_H

#include <napi.h>
#include <string>
#include <memory>
#include "libraw.h"

class LibRawWrapper : public Napi::ObjectWrap<LibRawWrapper> {
public:
    static Napi::Object Init(Napi::Env env, Napi::Object exports);
    LibRawWrapper(const Napi::CallbackInfo& info);
    ~LibRawWrapper();

private:
    static Napi::FunctionReference constructor;
    
    // Instance methods
    Napi::Value LoadFile(const Napi::CallbackInfo& info);
    Napi::Value GetMetadata(const Napi::CallbackInfo& info);
    Napi::Value GetImageSize(const Napi::CallbackInfo& info);
    Napi::Value Close(const Napi::CallbackInfo& info);
    
    // LibRaw instance
    std::unique_ptr<LibRaw> processor;
    bool isLoaded;
};

#endif // LIBRAW_WRAPPER_H
