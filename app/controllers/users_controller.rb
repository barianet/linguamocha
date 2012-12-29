require 'csv'

class UsersController < ApplicationController
  before_filter :correct_user, :only => [:edit, :update]
  
  def show
    @user = User.find_by_username(params[:username])
    @current_user = current_user
    @ip = request.remote_ip
    # if env[‘HTTP_X_REAL_IP’] 
    #   @ip = env[‘HTTP_X_REAL_IP’] 
    # else
    #   @ip = env[‘REMOTE_ADDR’]
    # end
    results = Geocoder.search(@ip)
    @location = results[0].city
    logger.debug "Results: #{results.inspect}"
  end
  
  def edit
    @user = current_user
    # @user.my_skills << MySkill.new
  end
  
  def update
    @user = current_user
    
    respond_to do |format|
      if @user.update_attributes(params[:user])
        format.html { redirect_to user_path(@user.username), notice: 'User was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @note.errors, status: :unprocessable_entity }
      end
    end
  end
  
  def all_skills
    # skills = []
    # CSV.open("skills.csv", "r").each do |csv_obj|
    #   skills << csv_obj
    # end
    
    skills = CSV.read("skills.csv").flatten
    
    
    # skills = Skill.pluck(:tag)
    
    respond_to do |format|
      format.json {render :json => skills.to_json}
    end
  end
  
end
