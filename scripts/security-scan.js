#!/usr/bin/env node

/**
 * Security Scanning Script
 * اسکن امنیتی خودکار برای شناسایی آسیب‌پذیری‌ها
 */

const fs = require('fs');
const path = require('path');

// Security rules and patterns
const SECURITY_RULES = {
  // Dangerous patterns
  dangerous_patterns: [
    {
      pattern: /\beval\s*\(/gi,
      severity: 'high',
      message: 'Use of eval() function is dangerous and should be avoided',
    },
    {
      pattern: /innerHTML\s*=/gi,
      severity: 'medium',
      message: 'Direct innerHTML assignment can lead to XSS',
    },
    {
      pattern: /document\.write\s*\(/gi,
      severity: 'medium',
      message: 'document.write() can be exploited for XSS',
    },
    {
      pattern: /dangerouslySetInnerHTML/gi,
      severity: 'medium',
      message: 'dangerouslySetInnerHTML should be used carefully',
    },
  ],

  // Hardcoded secrets
  secrets: [
    {
      pattern: /password\s*[:=]\s*['"][^'"]{8,}['"]/gi,
      severity: 'high',
      message: 'Potential hardcoded password detected',
    },
    {
      pattern: /api[_-]?key\s*[:=]\s*['"][^'"]{10,}['"]/gi,
      severity: 'high',
      message: 'Potential hardcoded API key detected',
    },
    {
      pattern: /secret\s*[:=]\s*['"][^'"]{10,}['"]/gi,
      severity: 'high',
      message: 'Potential hardcoded secret detected',
    },
    {
      pattern: /token\s*[:=]\s*['"][^'"]{10,}['"]/gi,
      severity: 'medium',
      message: 'Potential hardcoded token detected',
    },
  ],

  // Insecure HTTP requests
  http_security: [
    {
      pattern: /http:\/\/(?!localhost|127\.0\.0\.1)/gi,
      severity: 'medium',
      message: 'HTTP requests should use HTTPS in production',
    },
    {
      pattern: /fetch\([^)]*\)\s*\.then/gi,
      severity: 'low',
      message: 'Consider adding error handling for fetch requests',
    },
  ],

  // SQL Injection patterns
  sql_injection: [
    {
      pattern: /query\s*\+\s*['"`]/gi,
      severity: 'high',
      message: 'Potential SQL injection vulnerability',
    },
    {
      pattern: /\$\{[^}]*\}\s*['"`]/gi,
      severity: 'medium',
      message: 'Template literals in queries can be dangerous',
    },
  ],
};

// File extensions to scan
const SCAN_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.json'];

// Directories to exclude
const EXCLUDE_DIRS = [
  'node_modules',
  '.next',
  '.git',
  'coverage',
  '__tests__',
  'dist',
  'build',
];

class SecurityScanner {
  constructor() {
    this.issues = [];
    this.filesScanned = 0;
    this.startTime = Date.now();
  }

  shouldScanFile(filePath) {
    const ext = path.extname(filePath);
    return SCAN_EXTENSIONS.includes(ext);
  }

  shouldExcludeDir(dirPath) {
    const dirName = path.basename(dirPath);
    return EXCLUDE_DIRS.includes(dirName);
  }

  scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(process.cwd(), filePath);

      this.filesScanned++;

      // Scan for all rule categories
      Object.entries(SECURITY_RULES).forEach(([category, rules]) => {
        rules.forEach(rule => {
          this.checkPattern(content, rule, relativePath, category);
        });
      });
    } catch (error) {
      console.warn(
        `Warning: Could not scan file ${filePath}: ${error.message}`
      );
    }
  }

  checkPattern(content, rule, filePath, category) {
    const lines = content.split('\n');

    lines.forEach((line, lineNumber) => {
      const matches = line.match(rule.pattern);
      if (matches) {
        // Skip if it's in a comment
        const trimmedLine = line.trim();
        if (
          trimmedLine.startsWith('//') ||
          trimmedLine.startsWith('/*') ||
          trimmedLine.startsWith('*')
        ) {
          return;
        }

        this.issues.push({
          file: filePath,
          line: lineNumber + 1,
          severity: rule.severity,
          category: category,
          message: rule.message,
          match: matches[0],
          context: line.trim(),
        });
      }
    });
  }

  scanDirectory(dirPath) {
    try {
      const items = fs.readdirSync(dirPath);

      items.forEach(item => {
        const itemPath = path.join(dirPath, item);
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory()) {
          if (!this.shouldExcludeDir(itemPath)) {
            this.scanDirectory(itemPath);
          }
        } else if (stats.isFile() && this.shouldScanFile(itemPath)) {
          this.scanFile(itemPath);
        }
      });
    } catch (error) {
      console.warn(
        `Warning: Could not scan directory ${dirPath}: ${error.message}`
      );
    }
  }

  generateReport() {
    const endTime = Date.now();
    const duration = endTime - this.startTime;

    console.log('\n🔒 Security Scan Report');
    console.log('========================\n');

    console.log(`📊 Scan Statistics:`);
    console.log(`   Files scanned: ${this.filesScanned}`);
    console.log(`   Scan duration: ${duration}ms`);
    console.log(`   Issues found: ${this.issues.length}\n`);

    if (this.issues.length === 0) {
      console.log('✅ No security issues detected!\n');
      return;
    }

    // Group issues by severity
    const groupedIssues = this.issues.reduce((acc, issue) => {
      if (!acc[issue.severity]) acc[issue.severity] = [];
      acc[issue.severity].push(issue);
      return acc;
    }, {});

    const severityOrder = ['high', 'medium', 'low'];
    const severityIcons = { high: '🔴', medium: '🟡', low: '🟠' };

    severityOrder.forEach(severity => {
      if (groupedIssues[severity]) {
        console.log(
          `${severityIcons[severity]} ${severity.toUpperCase()} SEVERITY (${groupedIssues[severity].length} issues):`
        );
        console.log('─'.repeat(50));

        groupedIssues[severity].forEach((issue, index) => {
          console.log(`${index + 1}. ${issue.message}`);
          console.log(`   📁 File: ${issue.file}:${issue.line}`);
          console.log(`   📝 Category: ${issue.category}`);
          console.log(`   🔍 Context: ${issue.context}`);
          console.log('');
        });
      }
    });

    // Summary recommendations
    console.log('🛠️  Recommendations:');
    console.log('─'.repeat(20));

    const highIssues = groupedIssues.high?.length || 0;
    const mediumIssues = groupedIssues.medium?.length || 0;

    if (highIssues > 0) {
      console.log('❗ HIGH priority: Fix high severity issues immediately');
    }
    if (mediumIssues > 0) {
      console.log('⚠️  MEDIUM priority: Review and fix medium severity issues');
    }

    console.log(
      '📚 Consider using security linters like ESLint security plugin'
    );
    console.log('🔐 Regularly update dependencies to patch vulnerabilities');
    console.log('🧪 Implement security testing in your CI/CD pipeline\n');

    // Exit with error code if high severity issues found
    if (highIssues > 0) {
      console.log('❌ Security scan failed due to high severity issues');
      process.exit(1);
    }
  }

  run() {
    console.log('🔍 Starting security scan...\n');

    const projectRoot = process.cwd();
    this.scanDirectory(projectRoot);
    this.generateReport();
  }
}

// Additional security checks
function checkEnvironmentSecurity() {
  console.log('🌍 Checking environment security...\n');

  const envFile = path.join(process.cwd(), '.env.local');
  const envExampleFile = path.join(process.cwd(), '.env.example');

  // Check if .env.local exists
  if (fs.existsSync(envFile)) {
    console.log('✅ .env.local file found');

    // Check if sensitive data might be committed
    const gitignorePath = path.join(process.cwd(), '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
      if (!gitignoreContent.includes('.env.local')) {
        console.log('⚠️  WARNING: .env.local should be in .gitignore');
      }
    }
  } else {
    console.log('ℹ️  No .env.local file found');
  }

  // Check if .env.example exists
  if (fs.existsSync(envExampleFile)) {
    console.log('✅ .env.example file found');
  } else {
    console.log('ℹ️  Consider creating .env.example for documentation');
  }
}

function checkDependencySecurity() {
  console.log('📦 Checking dependency security...\n');

  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };
    const outdatedPatterns = ['*', '^0.', '~0.'];

    let hasOutdated = false;
    Object.entries(dependencies).forEach(([name, version]) => {
      if (outdatedPatterns.some(pattern => version.includes(pattern))) {
        if (!hasOutdated) {
          console.log('⚠️  Potentially outdated dependencies found:');
          hasOutdated = true;
        }
        console.log(`   - ${name}: ${version}`);
      }
    });

    if (!hasOutdated) {
      console.log('✅ No obviously outdated dependencies found');
    }
  } catch (error) {
    console.log('❌ Could not check dependencies:', error.message);
  }
}

// Main execution
if (require.main === module) {
  const scanner = new SecurityScanner();

  console.log('🛡️  WebRayan Security Scanner');
  console.log('============================\n');

  // Run all security checks
  checkEnvironmentSecurity();
  checkDependencySecurity();
  scanner.run();
}
