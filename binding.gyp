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
        "deps/LibRaw-Source/LibRaw-0.21.4/libraw",
        "deps/LibRaw-Source/LibRaw-0.21.4"
      ],
      "defines": [
        "NAPI_DISABLE_CPP_EXCEPTIONS",
        "LIBRAW_NO_MEMPOOL_CHECK"
      ],
      "conditions": [
        ["OS=='win'", {
          "libraries": [
            "<(module_root_dir)/deps/LibRaw-Source/LibRaw-0.21.4/lib/libraw.lib"
          ],
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
                "<(module_root_dir)/deps/LibRaw-Source/LibRaw-0.21.4/bin/libraw.dll"
              ]
            }
          ]
        }],
        ["OS=='mac'", {
          "libraries": [
            "<(module_root_dir)/deps/LibRaw-Source/LibRaw-0.21.4/lib/libraw.a"
          ]
        }],
        ["OS=='linux'", {
          "libraries": [
            "<(module_root_dir)/deps/LibRaw-Source/LibRaw-0.21.4/lib/libraw.a"
          ]
        }]
      ]
    }
  ]
}
