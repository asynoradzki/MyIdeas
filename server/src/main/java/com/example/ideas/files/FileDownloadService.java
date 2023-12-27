package com.example.ideas.files;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Stream;

@Service
public class FileDownloadService {

    public Resource getFileAsResource(String filesPath, String fileCode) throws IOException {
        Path dirPath = Paths.get(filesPath);
        Path foundFile;

        try (Stream<Path> files = Files.list(dirPath)) {
            foundFile = files.filter(file -> {
                String fileNameEncoded = encodeFilename(file.getFileName().toString());
                return fileNameEncoded.startsWith(fileCode);
            }).findFirst().orElse(null);
        }

        if (foundFile != null) {
            return new UrlResource(foundFile.toUri());
        }

        return null;
    }

    public String encodeFilename(String filename) {
        return URLEncoder.encode(filename, StandardCharsets.UTF_8);
    }
}
