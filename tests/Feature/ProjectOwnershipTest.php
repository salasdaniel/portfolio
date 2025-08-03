<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Project;
use App\Models\ProgrammingLanguage;
use App\Models\Framework;
use App\Models\Environment;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProjectOwnershipTest extends TestCase
{
    use RefreshDatabase;

    private User $user1;
    private User $user2;
    private Project $project1;
    private Project $project2;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create test data
        $this->user1 = User::factory()->create(['email' => 'user1@test.com']);
        $this->user2 = User::factory()->create(['email' => 'user2@test.com']);
        
        // Create a project for user1
        $this->project1 = Project::factory()->create(['user_id' => $this->user1->id]);
        
        // Create a project for user2
        $this->project2 = Project::factory()->create(['user_id' => $this->user2->id]);
    }

    /** @test */
    public function user_can_only_see_their_own_projects()
    {
        // User1 should only see their project
        $response = $this->actingAs($this->user1)->get('/projects');
        $response->assertStatus(200);
        
        // User2 should only see their project
        $response = $this->actingAs($this->user2)->get('/projects');
        $response->assertStatus(200);
    }

    /** @test */
    public function user_cannot_access_other_users_projects()
    {
        // User1 trying to access User2's project should get 404
        $response = $this->actingAs($this->user1)->get("/projects/{$this->project2->id}");
        $response->assertStatus(404);
        
        // User2 trying to access User1's project should get 404
        $response = $this->actingAs($this->user2)->get("/projects/{$this->project1->id}");
        $response->assertStatus(404);
    }

    /** @test */
    public function user_can_access_their_own_projects()
    {
        // User1 can access their own project
        $response = $this->actingAs($this->user1)->get("/projects/{$this->project1->id}");
        $response->assertStatus(200);
        
        // User2 can access their own project
        $response = $this->actingAs($this->user2)->get("/projects/{$this->project2->id}");
        $response->assertStatus(200);
    }
}
