#!/usr/bin/env ruby

hosts = [
  "4edb6da549bd1378a50000a14edb6bf849bd1378a500009e",
  "4c320675d1748267bb0001274c320675d1748267bb000125",
  "4c32fd71d1748274a50000044c32fcf6d1748274a5000002",
  "4c3adacfd174821ad20000054c3ad9c1d174821aea000001",
  "4c3b6c21d1748226900000044c3b6bdad174822690000002",
  "4c3c3b06d174822fad0000084c3c3a60d1748230ae000002",
  "4c3c5135d1748233ac0000074c3c50ffd1748233ac000004",
  "4c3c5911d1748233ac00004b4c3c58c6d1748233ac000049",
  "4c3c6c82d17482386e0000054c3c6bded17482386e000003",
  "4c3c6e97d1748239bf0000064c3c6e64d1748239bf000004",
  "4c3c6ef9d1748239e30000064c3c6dbbd17482386e000010",
  "4c3c7437d174823a9900000c4c3c740cd174823b5b000003",
  "4c3c820ad174823e560000024c3c81a6d174823e60000003",
  "4c3c9699d1748240c70000014c3c9352d17482404c000002"
  #"4c3cbb2ad1748248920000044c3cba7dd174824892000002",
  #"4c3cca1dd174824d0c0000044c3cc72bd174824c05000002",
  #"4c3cd13bd174824e190000064c3cc9ffd174824d0c000003",
  #"4c3cd17ad174824e190000094c3cd007d174824e19000002",
  #"4c3cdb74d174824ff70000024c3cda14d174824f11000002",
  #"4c3ce45cd1748254830000034c3ce40cd174825483000001",
  #"4c3ce850d1748256d30000034c3ce77bd1748252e6000007",
  #"4c3d45a6d1748260d20000034c3d4516d1748260d2000002",
  #"4c3d52d4d1748264eb0000034c3d4f9dd174826444000002",
  #"4c3d55ccd1748264eb0000184c3d5567d1748264eb000016",
  #"4c3d56c9d1748266f10000024c320675d1748267bb000125",
  #"4c3d6414d174826d050000074c3d638ed174826afc000002",
  #"4c3d6d20d174826e670000044c3d6cdad174826e67000002",
  #"4c3d73d4d1748271bf0000064c3d732bd1748271bf000004",
  #"4c3d8267d1748277f20000014c3d80c4d1748275fa000008",
  #"4c3d82a2d1748277fc0000084c3d827cd1748277f2000004",
  #"4c3d82ccd1748277fc00000b4c3d824dd1748277fc000002",
  #"4c3d832ad1748279b00000014c3d827cd1748277f2000004",
  #"4c3d8456d1748279a60000074c3d8410d1748279a6000004",
  #"4c3db58ad174820bd30000014c3db4f3d174820b3100001e",
  #"4c3dc783d17482145f0000064c3dc769d17482145f000004",
  #"4c3dd021d1748215be0000064c3dce4ed174821530000002",
  #"4c3dd617d1748216cd0000014c3dd4fcd1748215be000011",
  #"4c3ddec9d1748217fe0000024c3dde2bd1748217c9000001",
  #"4c3ddf6fd1748217fe00000d4c3ddef5d1748217fe000009",
  #"4c3ddfe4d1748217f40000034c3ddf9dd1748217f4000001",
  #"4c3df5e5d174821b010000044c3df5c5d174821b01000002",
  #"4c3e0239d174821ca500000c4c3e01add174821e30000001",
  #"4c3e065bd174821ed60000044c3dfeced174821ca5000001",
  #"4c3e06ccd174821ed60000164c3e0651d174821ed6000003",
  #"4c3e07d2d174821fb40000014c3e06abd174821ed6000015",
  #"4c3e10e7d1748226590000064c3e0e43d174822183000003",
  #"4c3e1209d17482264d0000014c3e0cedd17482211c000001",
  #"4c3e1613d1748226940000034c3e1547d174822694000001",
  #"4c3e1996d1748226940000134c3e1955d174822694000011",
  #"4c3e23b5d1748228930000064c3e2382d174822893000004",
  #"4c3e23d1d1748228930000094c3e2382d174822893000004"
]
langs = [
  "af",
  "sq",
  #"ar",
  "be",
  "bg",
  "ca",
  "zh",
  "hr",
  "cs",
  "da",
  "nl",
  "en",
  "et",
  "tl",
  "fi",
  "fr",
  "gl",
  "de",
  "el",
  "iw",
  "hi",
  "hu",
  "is",
  "id",
  "ga",
  "it",
  "ja",
  "ko",
  "lv",
  "lt",
  "mk",
  "ms",
  "mt",
  "fa",
  "pl",
  "pt-PT",
  "ro",
  "ru",
  "sr",
  "sk",
  "sl",
  "es",
  "sw",
  "sv",
  "th",
  "tr",
  "uk",
  "vi",
  "cy",
  "yi"
]

pages_path = "../fixture"
pages = [
  "dakwak_home.html",
  "gate2play_home.html",
  "idealratings_home.html",
  "idealratings_news.html",
  "reroute.html",
  "shopandship_home.html",
  "wheels_express_home.html"
]
host = hosts[Random.rand(0..hosts.length-1)]
tolang = langs[Random.rand(0..langs.length-1)]

path = nil
if ARGV.count > 0 then path = ARGV[0] else
  path = File.join(pages_path, pages[Random.rand(0..pages.length-1)])
end

system("curl -X POST -d @#{path} \
-H 'Content-Type: text/html' \
-H 'Dakwak-APIKey: #{host}' \
-H 'Dakwak-ToLang: #{tolang}' \
 http://localhost:9090/")