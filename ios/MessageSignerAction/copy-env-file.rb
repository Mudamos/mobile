#!/usr/bin/env ruby

file = ARGV.first || ".env"
puts "Picking env file"

puts "Will add file: #{file}"

raw = File.read(File.join(Dir.pwd, "../#{file}"))

puts "Envs:"
puts raw

path = File.join(ENV["CONFIGURATION_BUILD_DIR"], ENV["UNLOCALIZED_RESOURCES_FOLDER_PATH"], "envfile")
File.open(path, "w") { |f| f.puts raw }

puts "Wrote to #{path}"
