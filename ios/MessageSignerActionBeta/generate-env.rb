#!/usr/bin/env ruby

# pick a custom env file if set
if File.exists?("/tmp/envfile")
  custom_env = true
  file = File.read("/tmp/envfile").strip
  else
  custom_env = false
  file = ".env"
end

raw = File.read(File.join(Dir.pwd, "../#{file}"))

path = File.join(ENV["CONFIGURATION_BUILD_DIR"], ENV["UNLOCALIZED_RESOURCES_FOLDER_PATH"], "envfile")
File.open(path, "w") { |f| f.puts raw }

if custom_env
  File.delete("/tmp/envfile")
end

puts "Wrote to #{path}"
