{
  "targets": [
    {
      "target_name": "libraw_addon",
      "sources": [
        "src/addon.cpp",
        "src/libraw_wrapper.cpp"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
        "C:/Users/baolq/Documents/lightdrift-libraw/LibRaw-Win64/LibRaw-0.21.4/libraw",
        "C:/Users/baolq/Documents/lightdrift-libraw/LibRaw-Win64/LibRaw-0.21.4"
      ],
      "libraries": [
        "C:/Users/baolq/Documents/lightdrift-libraw/LibRaw-Win64/LibRaw-0.21.4/lib/libraw.lib"
      ],
      "defines": [
        "NAPI_DISABLE_CPP_EXCEPTIONS"
      ],
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      "msvs_settings": {
        "VCCLCompilerTool": {
          "ExceptionHandling": 1,
          "RuntimeLibrary": 2
        }
      },
      "copies": [
        {
          "destination": "<(module_root_dir)/build/Release/",
          "files": [
            "C:/Users/baolq/Documents/lightdrift-libraw/LibRaw-Win64/LibRaw-0.21.4/bin/libraw.dll"
          ]
        }
      ]
    }
  ]
}
