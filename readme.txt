=== WP Dev Habit: Your Daily Content Prompter ===


Contributors: oneoffboss
Tags: documentation, journal, developer tools, github, content creator, productivity, writing helper, log


Requires at least: 5.8
Tested up to: 6.6
Requires PHP: 7.4
Stable tag: 0.2.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

A simple, elegant tool that asks probing questions via the WordPress admin to help you generate content, document your daily progress, and build a consistent journaling habit. Logs can be copied or automatically saved to GitHub.

== Description ==

WP Dev Habit was born from a personal need: to find a healthier, more productive way to channel the anxious energy that comes with complex development work and build a consistent habit of documenting the process.

This plugin adds a guided journaling tool directly into your WordPress admin dashboard ("Dev Habit Log"). By answering a series of targeted prompts at the end of your workday, you generate a clean, structured Markdown log of your progress, challenges, and learnings.

Core Features:

Guided Journaling: A series of prompts to structure your thoughts.

Markdown Generation: Automatically formats answers into a clean Markdown document.

Copy to Clipboard: Easily copy the generated log for pasting anywhere.

Direct GitHub Save: (Version 0.2.0+) Automatically commit the generated log as a new .md file (YYYY-MM-DD-log.md) to a designated GitHub repository.

Simple Settings: Configure your GitHub integration (PAT, username, repo, file path).

Lightweight & Focused: No database entries for logs (yet), minimal dependencies, designed to be non-intrusive.

The goal is to make documentation a seamless, low-effort part of your existing workflow, turning it from a chore into a consistent habit.

This plugin is free, open-source, and developed in public. Learn more at https://wp-devhabit.com.

== Installation ==

Download the .zip file from the WordPress.org plugin directory (or GitHub releases).

In your WordPress admin dashboard, navigate to Plugins > Add New.

Click the "Upload Plugin" button at the top of the page.

Choose the .zip file you downloaded and click "Install Now".

Once installed, click "Activate Plugin".

You will find the "Dev Habit Log" page under the main "WP Dev Habit" menu item in your admin sidebar.

(Optional) Navigate to the "Settings" submenu under "Dev Habit Log" to configure the GitHub integration if you wish to use the auto-save feature. You will need a GitHub Personal Access Token with repo or public_repo scope.

== Frequently Asked Questions ==

= Where are my logs saved? =

As of version 0.2.0, logs are not saved in the WordPress database. You have two options on the results screen:

Copy to Clipboard: Manually paste the log wherever you like (blog post, wiki, notes app).

Save to GitHub: Automatically commit the log as a new Markdown file to the GitHub repository you configure in the Settings.

= How do I set up the GitHub integration? =

Generate a Personal Access Token (PAT) on GitHub with the repo or public_repo scope. 

Go to the Dev Habit Log > Settings page in your WordPress admin.

Enter your GitHub PAT, GitHub Username, the name of the repository you want to save logs to, and optionally, a specific file path within that repo (defaults to /_logs/).

Save the settings. The "Save to GitHub" button will now attempt to save logs automatically.

= Can I customize the questions? =

Not yet. This is a planned feature for a future version.

= Is this plugin free? =

Yes, WP DevHabit is free and open-source under the GPLv2 (or later) license.

== Screenshots ==

The guided journaling interface.

The results screen showing the generated Markdown log and action buttons.

The GitHub integration settings page.

(Note: You will need to add actual screenshot files named screenshot-1.png, screenshot-2.png, etc., to the /assets directory in your plugin's SVN repository later)

== Changelog ==

= 0.2.0 =

FEATURE: Added GitHub integration to automatically save logs as Markdown files in a repository.

FEATURE: Added Settings page for configuring GitHub PAT, username, repo, and path.

ENHANCEMENT: Updated results screen UI to include "Save to GitHub" button and status messages.

ENHANCEMENT: Updated admin menu structure (main log page + settings submenu).

ENHANCEMENT: Improved clipboard fallback for copying text.

FIX: Added nonce verification and capability checks to AJAX handler for security.

FIX: Added sanitization for all saved settings and incoming log content.

= 0.1.0 =

Initial release.

Adds an admin page with the guided questionnaire.

Generates a formatted text/markdown log.

Includes a "Copy to Clipboard" feature.

== Upgrade Notice ==

= 0.2.0 =
This version introduces the GitHub integration feature. Please visit the new Settings page under "Dev Habit Log" to configure your GitHub connection.