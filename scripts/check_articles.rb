require "date"
require "yaml"

ROOT = File.expand_path("..", __dir__)
REQUIRED_LABELS = %w[published updated author languages table sources related index].freeze
REQUIRED_FIELDS = %w[title description lang permalink translations article_labels].freeze
errors = []
articles = Dir.glob(File.join(ROOT, "{kasvit,en,th}/**/*.md"), File::FNM_EXTGLOB)
article_permalinks = []
translation_refs = []
checked = 0

articles.each do |file|
  raw = File.read(file, encoding: "UTF-8")
  match = raw.match(/\A---\s*\r?\n(.*?)\r?\n---\s*(?:\r?\n|\z)/m)
  unless match
    errors << "#{file}: missing YAML front matter"
    next
  end

  begin
    data = YAML.safe_load(match[1], permitted_classes: [Date, Time], aliases: true) || {}
  rescue Psych::Exception => error
    errors << "#{file}: invalid front matter (#{error.message.lines.first.strip})"
    next
  end

  next unless data["layout"] == "article"
  checked += 1
  article_permalinks << data["permalink"]

  REQUIRED_FIELDS.each { |key| errors << "#{file}: missing #{key}" if data[key].nil? || data[key].to_s.empty? }
  labels = data["article_labels"] || {}
  (REQUIRED_LABELS - labels.keys).each { |key| errors << "#{file}: missing article_labels.#{key}" }

  translation_urls = Array(data["translations"]).map { |translation| translation["url"] }
  errors << "#{file}: translations must include the page permalink" unless translation_urls.include?(data["permalink"])
  translation_refs.concat(translation_urls.map { |url| [file, url] })

  %w[play pause loading error note aria_label].each do |key|
    errors << "#{file}: missing audio.#{key}" if data["audio"] && data.dig("audio", key).to_s.empty?
  end

  media_paths = [data["image"], data.dig("audio", "src")]
  raw.scan(/\{\{\s*['\"](\/assets\/[^'\"]+)['\"]\s*\|\s*relative_url\s*\}\}/).each { |ref| media_paths << ref.first }
  media_paths.compact.uniq.each do |url|
    local_path = File.join(ROOT, url.delete_prefix("/"))
    errors << "#{file}: referenced asset does not exist: #{url}" unless File.file?(local_path)
  end
end

translation_refs.each do |file, url|
  errors << "#{file}: translation permalink has no article page: #{url}" unless article_permalinks.include?(url)
end

if errors.empty?
  puts "Checked #{checked} article pages and their required metadata/assets."
else
  warn errors.join("\n")
  exit 1
end
