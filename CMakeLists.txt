cmake_minimum_required(VERSION 3.15)
project(libraw_addon)

# 设置 C++ 标准
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 设置构建类型
if(NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE Release)
endif()

# 查找 node-addon-api

# 设置 node-addon-api 路径
set(NAPI_INCLUDE_DIR "${CMAKE_CURRENT_SOURCE_DIR}/node_modules/node-addon-api")

# 检查 node-addon-api 是否存在
if(NOT EXISTS "${NAPI_INCLUDE_DIR}")
    message(FATAL_ERROR "node-addon-api not found. Please run 'npm install' first.")
endif()

# 查找 Node.js 头文件
execute_process(
    COMMAND node -p "process.execPath"
    OUTPUT_VARIABLE NODE_EXECUTABLE
    OUTPUT_STRIP_TRAILING_WHITESPACE
)

get_filename_component(NODE_ROOT_DIR "${NODE_EXECUTABLE}" DIRECTORY)
set(NODE_INCLUDE_DIR "${NODE_ROOT_DIR}/../include/node")

# 检查 Node.js 头文件是否存在
if(NOT EXISTS "${NODE_INCLUDE_DIR}")
    # 尝试其他常见路径
    set(NODE_INCLUDE_DIR "${NODE_ROOT_DIR}/../include")
    if(NOT EXISTS "${NODE_INCLUDE_DIR}")
        message(FATAL_ERROR "Node.js headers not found. Please install node development headers.")
    endif()
endif()

# 设置 LibRaw 路径
set(LIBRAW_SOURCE_DIR "${CMAKE_CURRENT_SOURCE_DIR}/deps/LibRaw-Source/LibRaw-0.21.4")
set(LIBRAW_INCLUDE_DIR "${LIBRAW_SOURCE_DIR}/libraw")
set(LIBRAW_LIB_DIR "${LIBRAW_SOURCE_DIR}/lib")

# 检查 LibRaw 是否存在
if(NOT EXISTS "${LIBRAW_SOURCE_DIR}")
    message(FATAL_ERROR "LibRaw source not found. Please run 'npm run build:libraw' first.")
endif()

# 创建 addon 目标
add_library(libraw_addon SHARED
    src/addon.cpp
    src/libraw_wrapper.cpp
)

# 设置包含目录
target_include_directories(libraw_addon PRIVATE
    ${NAPI_INCLUDE_DIR}
    ${NODE_INCLUDE_DIR}
    ${LIBRAW_INCLUDE_DIR}
    ${LIBRAW_SOURCE_DIR}
)

# 链接 LibRaw 库
target_link_libraries(libraw_addon PRIVATE
    ${LIBRAW_LIB_DIR}/libraw.a
)

# 设置编译定义
target_compile_definitions(libraw_addon PRIVATE
    NAPI_DISABLE_CPP_EXCEPTIONS
    LIBRAW_NO_EXCEPTIONS
    NO_EXCEPTIONS
)

# 设置编译选项
if(MSVC)
    target_compile_options(libraw_addon PRIVATE
        /W3
        /EHsc
    )
else()
    target_compile_options(libraw_addon PRIVATE
        -Wall
        -Wextra
        -fno-exceptions
        -fno-rtti
    )
endif()

# 设置输出目录
set_target_properties(libraw_addon PROPERTIES
    OUTPUT_NAME "libraw_addon"
    SUFFIX ".node"
    LIBRARY_OUTPUT_DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}/build/Release"
)

# 复制 LibRaw 库文件到输出目录
if(WIN32)
    # Windows 需要复制 DLL 文件
    add_custom_command(TARGET libraw_addon POST_BUILD
        COMMAND ${CMAKE_COMMAND} -E copy_if_different
        "${LIBRAW_SOURCE_DIR}/bin/libraw.dll"
        "${CMAKE_CURRENT_SOURCE_DIR}/build/Release/"
    )
endif()

# 打印构建信息
message(STATUS "Build type: ${CMAKE_BUILD_TYPE}")
message(STATUS "LibRaw source: ${LIBRAW_SOURCE_DIR}")
message(STATUS "LibRaw include: ${LIBRAW_INCLUDE_DIR}")
message(STATUS "LibRaw lib: ${LIBRAW_LIB_DIR}")
message(STATUS "Node.js: Using node-addon-api")
message(STATUS "NAPI include: ${NAPI_INCLUDE_DIR}")
